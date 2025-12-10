// src/collectors/base-collector.ts
/**
 * Base Collector Class
 * 
 * Abstract base class for all platform-specific collectors.
 * Provides common functionality for data collection.
 */

import { 
  Platform, 
  PriceDataPoint, 
  BenchmarkConfig,
  CollectionResult,
} from "../models/types";
import { logger } from "../utils/logger";
import fs from "fs";
import path from "path";

export abstract class BaseCollector {
  protected platform: Platform;
  protected dataDir: string;

  constructor(platform: Platform) {
    this.platform = platform;
    this.dataDir = process.env.RAW_DATA_DIR || "./data/raw";
    
    // Ensure data directory exists
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  /**
   * Main collection method - to be implemented by subclasses
   */
  abstract collect(config: BenchmarkConfig): Promise<CollectionResult>;

  /**
   * Search for products matching the query
   */
  abstract search(query: string, options?: SearchOptions): Promise<PriceDataPoint[]>;

  /**
   * Save raw data to disk
   */
  protected saveRawData(benchmark: string, data: PriceDataPoint[]): void {
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `${benchmark}_${this.platform}_${timestamp}.json`;
    const filepath = path.join(this.dataDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    logger.info(`Saved ${data.length} data points to ${filepath}`);
  }

  /**
   * Filter products based on benchmark config
   */
  protected filterProducts(
    products: PriceDataPoint[],
    config: BenchmarkConfig
  ): PriceDataPoint[] {
    return products.filter((product) => {
      // Price filter
      if (config.priceFilter) {
        if (config.priceFilter.min && product.price < config.priceFilter.min) {
          return false;
        }
        if (config.priceFilter.max && product.price > config.priceFilter.max) {
          return false;
        }
      }

      // Condition filter
      if (config.conditionFilter && !config.conditionFilter.includes(product.condition)) {
        return false;
      }

      // Exclude keywords (check in product title if available)
      // This is handled during search by the specific collector

      return true;
    });
  }

  /**
   * Calculate statistics from collected data
   */
  protected calculateStats(data: PriceDataPoint[]): {
    count: number;
    avgPrice: number;
    medianPrice: number;
    minPrice: number;
    maxPrice: number;
  } {
    if (data.length === 0) {
      return { count: 0, avgPrice: 0, medianPrice: 0, minPrice: 0, maxPrice: 0 };
    }

    const prices = data.map((d) => d.price).sort((a, b) => a - b);
    const sum = prices.reduce((a, b) => a + b, 0);
    const mid = Math.floor(prices.length / 2);

    return {
      count: prices.length,
      avgPrice: Math.round((sum / prices.length) * 100) / 100,
      medianPrice: prices.length % 2 
        ? prices[mid] 
        : (prices[mid - 1] + prices[mid]) / 2,
      minPrice: prices[0],
      maxPrice: prices[prices.length - 1],
    };
  }

  /**
   * Create a standard CollectionResult
   */
  protected createResult(
    benchmark: string,
    startTime: Date,
    dataPoints: PriceDataPoint[],
    errors: string[] = []
  ): CollectionResult {
    return {
      benchmark,
      platform: this.platform,
      startTime: startTime.toISOString(),
      endTime: new Date().toISOString(),
      totalProducts: dataPoints.length,
      validProducts: dataPoints.filter((d) => d.price > 0).length,
      errors,
      dataPoints,
    };
  }
}

export interface SearchOptions {
  maxResults?: number;
  sortBy?: "price" | "relevance" | "date";
  condition?: "new" | "refurbished" | "used";
  priceMin?: number;
  priceMax?: number;
}
