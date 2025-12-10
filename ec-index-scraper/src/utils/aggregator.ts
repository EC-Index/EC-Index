// src/utils/aggregator.ts
/**
 * Data Aggregator
 * 
 * Combines collected data from multiple platforms and calculates
 * aggregated metrics for the EC-Index benchmarks.
 */

import fs from "fs";
import path from "path";
import { 
  PriceDataPoint, 
  AggregatedPrice, 
  CollectionResult,
  Platform,
  ExportJsonFormat,
  ExportSeriesData,
} from "../models/types";
import { logger } from "./logger";

// Platform colors for charts
const PLATFORM_COLORS: Record<Platform, string> = {
  amazon: "#FF9900",
  ebay: "#E53238",
  idealo: "#0066CC",
  geizhals: "#1E3A5F",  // Geizhals dark blue
  check24: "#063773",
  otto: "#C41230",
  mediamarkt: "#DF0000",
  saturn: "#004F9F",
  other: "#6B7280",
};

export class DataAggregator {
  private rawDataDir: string;
  private processedDataDir: string;
  private exportDir: string;

  constructor() {
    this.rawDataDir = process.env.RAW_DATA_DIR || "./data/raw";
    this.processedDataDir = process.env.PROCESSED_DATA_DIR || "./data/processed";
    this.exportDir = process.env.EXPORT_DIR || "./data/export";

    // Ensure directories exist
    [this.rawDataDir, this.processedDataDir, this.exportDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Aggregate collection results into daily/weekly summaries
   */
  aggregateResults(results: CollectionResult[]): Map<string, AggregatedPrice[]> {
    const aggregated = new Map<string, AggregatedPrice[]>();

    for (const result of results) {
      const key = `${result.benchmark}_${result.platform}`;
      
      if (result.dataPoints.length === 0) continue;

      const prices = result.dataPoints.map(p => p.price).filter(p => p > 0);
      if (prices.length === 0) continue;

      prices.sort((a, b) => a - b);
      const mid = Math.floor(prices.length / 2);

      const agg: AggregatedPrice = {
        date: new Date().toISOString().split("T")[0],
        platform: result.platform,
        category: result.benchmark,
        averagePrice: Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100,
        medianPrice: prices.length % 2 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2,
        minPrice: prices[0],
        maxPrice: prices[prices.length - 1],
        sampleSize: prices.length,
      };

      if (!aggregated.has(result.benchmark)) {
        aggregated.set(result.benchmark, []);
      }
      aggregated.get(result.benchmark)!.push(agg);
    }

    return aggregated;
  }

  /**
   * Load historical data for a benchmark
   */
  loadHistoricalData(benchmarkCode: string): Map<string, AggregatedPrice[]> {
    const historyFile = path.join(this.processedDataDir, `${benchmarkCode}_history.json`);
    
    if (!fs.existsSync(historyFile)) {
      return new Map();
    }

    try {
      const data = JSON.parse(fs.readFileSync(historyFile, "utf-8"));
      return new Map(Object.entries(data));
    } catch (error) {
      logger.error(`Failed to load historical data for ${benchmarkCode}`);
      return new Map();
    }
  }

  /**
   * Save aggregated data to history
   */
  saveToHistory(benchmarkCode: string, newData: AggregatedPrice[]): void {
    const historyFile = path.join(this.processedDataDir, `${benchmarkCode}_history.json`);
    
    // Load existing history
    let history: Record<string, AggregatedPrice[]> = {};
    if (fs.existsSync(historyFile)) {
      try {
        history = JSON.parse(fs.readFileSync(historyFile, "utf-8"));
      } catch (error) {
        logger.warn(`Could not parse history file, starting fresh`);
      }
    }

    // Add new data, grouped by date-platform
    for (const data of newData) {
      const key = `${data.date}_${data.platform}`;
      if (!history[key]) {
        history[key] = [];
      }
      // Replace if same date/platform exists
      const existing = history[key].findIndex(
        h => h.date === data.date && h.platform === data.platform
      );
      if (existing >= 0) {
        history[key][existing] = data;
      } else {
        history[key].push(data);
      }
    }

    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
    logger.info(`Updated history for ${benchmarkCode}`);
  }

  /**
   * Export benchmark data to website JSON format
   */
  exportToWebsiteFormat(benchmarkCode: string): ExportJsonFormat | null {
    const historyFile = path.join(this.processedDataDir, `${benchmarkCode}_history.json`);
    
    if (!fs.existsSync(historyFile)) {
      logger.warn(`No history data for ${benchmarkCode}`);
      return null;
    }

    try {
      const history: Record<string, AggregatedPrice[]> = JSON.parse(
        fs.readFileSync(historyFile, "utf-8")
      );

      // Group by platform
      const platformData = new Map<Platform, Array<{ date: string; value: number }>>();

      for (const dataPoints of Object.values(history)) {
        for (const point of dataPoints) {
          if (!platformData.has(point.platform)) {
            platformData.set(point.platform, []);
          }
          platformData.get(point.platform)!.push({
            date: point.date,
            value: point.averagePrice,
          });
        }
      }

      // Sort each platform's data by date
      for (const [platform, data] of platformData) {
        data.sort((a, b) => a.date.localeCompare(b.date));
      }

      // Convert to export format
      const series: ExportSeriesData[] = [];
      for (const [platform, data] of platformData) {
        if (data.length > 0) {
          series.push({
            name: this.formatPlatformName(platform),
            color: PLATFORM_COLORS[platform],
            data: data,
          });
        }
      }

      // Calculate total sample size
      const totalSamples = Array.from(platformData.values())
        .flat()
        .reduce((sum, d) => sum + 1, 0);

      const result: ExportJsonFormat = {
        series,
        metadata: {
          source: `EC-Index Data Collection (${series.map(s => s.name).join(", ")})`,
          lastUpdated: new Date().toISOString().split("T")[0],
          sampleSize: `~${this.formatNumber(totalSamples * 50)} products`, // Estimate
          methodology: this.getMethodologyText(benchmarkCode),
        },
      };

      // Save to export directory
      const exportFile = path.join(this.exportDir, `${this.getJsonFilename(benchmarkCode)}.json`);
      fs.writeFileSync(exportFile, JSON.stringify(result, null, 2));
      logger.info(`Exported ${benchmarkCode} to ${exportFile}`);

      return result;

    } catch (error: any) {
      logger.error(`Failed to export ${benchmarkCode}`, { error: error.message });
      return null;
    }
  }

  /**
   * Get JSON filename for benchmark
   */
  private getJsonFilename(benchmarkCode: string): string {
    const mapping: Record<string, string> = {
      "ECI-SMP-300": "smp-300",
      "ECI-SUP-VIT": "sup-vit",
      "ECI-SNK-MEN": "snk-men",
      "ECI-ELC-VOL": "elc-vol",
      "ECI-FSN-DIS": "fsn-dis",
    };
    return mapping[benchmarkCode] || benchmarkCode.toLowerCase();
  }

  /**
   * Format platform name for display
   */
  private formatPlatformName(platform: Platform): string {
    const names: Record<Platform, string> = {
      amazon: "Amazon",
      ebay: "eBay",
      idealo: "Idealo",
      geizhals: "Geizhals",
      check24: "Check24",
      otto: "Otto",
      mediamarkt: "MediaMarkt",
      saturn: "Saturn",
      other: "Other",
    };
    return names[platform];
  }

  /**
   * Format number with thousands separator
   */
  private formatNumber(num: number): string {
    return num.toLocaleString("de-DE");
  }

  /**
   * Get methodology text for benchmark
   */
  private getMethodologyText(benchmarkCode: string): string {
    const methodologies: Record<string, string> = {
      "ECI-SMP-300": "Weekly weighted average of listing prices for new smartphones under €300. Weighted by seller rating. Excludes refurbished and B-stock.",
      "ECI-SUP-VIT": "Weekly average of normalized prices for top supplement categories. Commercial sellers only. Prices normalized to standard dosage.",
      "ECI-SNK-MEN": "Weekly count of active fixed-price listings in men's sneaker category. Duplicate detection and exclusion of counterfeits.",
    };
    return methodologies[benchmarkCode] || "Aggregated marketplace data";
  }
}

export const aggregator = new DataAggregator();
