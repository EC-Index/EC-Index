import { ChartSeries, TimeRange } from "@/lib/types/chart.types";
import { generateMockSeries } from "./mock-generator";

export interface DataLoaderOptions {
  source: "mock" | "csv" | "json" | "api";
  timeRange?: TimeRange;
  fallbackToMock?: boolean;
}

export class DataLoader {
  /**
   * Load chart data from various sources
   */
  static async load(
    chartId: string,
    options: DataLoaderOptions = { source: "mock" }
  ): Promise<ChartSeries[]> {
    const { source, timeRange, fallbackToMock = true } = options;

    try {
      switch (source) {
        case "csv":
          return await this.loadFromCSV(chartId, timeRange);
        case "json":
          return await this.loadFromJSON(chartId, timeRange);
        case "api":
          return await this.loadFromAPI(chartId, timeRange);
        case "mock":
        default:
          return await this.loadMock(chartId, timeRange);
      }
    } catch (error) {
      console.error(`Failed to load data from ${source}:`, error);
      
      if (fallbackToMock && source !== "mock") {
        console.warn(`Falling back to mock data for chart ${chartId}`);
        return await this.loadMock(chartId, timeRange);
      }
      
      throw error;
    }
  }

  /**
   * Load from CSV file (future implementation)
   */
  private static async loadFromCSV(
    chartId: string,
    timeRange?: TimeRange
  ): Promise<ChartSeries[]> {
    // TODO: Implement CSV loading
    // 1. Fetch CSV from /data/charts/{chartId}.csv
    // 2. Parse with papaparse or similar
    // 3. Transform to ChartSeries format
    // 4. Filter by timeRange if provided
    
    throw new Error("CSV loading not yet implemented");
  }

  /**
   * Load from JSON file
   */
  private static async loadFromJSON(
    chartId: string,
    timeRange?: TimeRange
  ): Promise<ChartSeries[]> {
    try {
      const response = await fetch(`/data/charts/${chartId}.json`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch JSON: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform and filter if needed
      return this.filterByTimeRange(data.series, timeRange);
    } catch (error) {
      throw new Error(`JSON loading failed: ${error}`);
    }
  }

  /**
   * Load from API endpoint (future implementation)
   */
  private static async loadFromAPI(
    chartId: string,
    timeRange?: TimeRange
  ): Promise<ChartSeries[]> {
    const params = new URLSearchParams();
    if (timeRange) params.set("timeRange", timeRange);

    const response = await fetch(
      `/api/charts/${chartId}?${params.toString()}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data.series;
  }

  /**
   * Load mock data
   */
  private static async loadMock(
    chartId: string,
    timeRange?: TimeRange
  ): Promise<ChartSeries[]> {
    const series = generateMockSeries(chartId, timeRange);
    return Promise.resolve(series);
  }

  /**
   * Filter series by time range
   */
  private static filterByTimeRange(
    series: ChartSeries[],
    timeRange?: TimeRange
  ): ChartSeries[] {
    if (!timeRange || timeRange === "all") return series;

    const days = this.getDaysFromTimeRange(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return series.map((s) => ({
      ...s,
      data: s.data.filter((point) => new Date(point.date) >= cutoffDate),
    }));
  }

  /**
   * Convert TimeRange to days
   */
  private static getDaysFromTimeRange(timeRange: TimeRange): number {
    const mapping: Record<TimeRange, number> = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "6m": 180,
      "1y": 365,
      "2y": 730,
      all: 9999,
    };
    return mapping[timeRange] || 365;
  }
}