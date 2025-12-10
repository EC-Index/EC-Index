// lib/types.ts
/**
 * EC-Index Type Definitions
 * Central type definitions for the entire EC-Index project.
 */

// ============================================================================
// PLATFORM & CATEGORY TYPES
// ============================================================================

export type Platform =
  | "amazon"
  | "ebay"
  | "temu"
  | "shein"
  | "idealo"
  | "geizhals"
  | "check24"
  | "other";

export type ChartCategory =
  | "prices"
  | "supply"
  | "demand"
  | "discounts"
  | "market-share"
  | "volatility"
  | "listings"
  | "concentration";

export type TimeRange = "7d" | "30d" | "90d" | "1y" | "2y" | "all";

// ============================================================================
// DATA SOURCE TYPE
// ============================================================================

/**
 * Defines where chart data comes from
 * - "json": Real data from JSON files in lib/data/
 * - "mock": Generated mock data via getMockSeries()
 */
export type DataSourceType = "json" | "mock";

// ============================================================================
// BENCHMARK CODES
// ============================================================================

/**
 * Official EC-Index Benchmark Codes
 */
export type BenchmarkCode =
  | "ECI-SMP-300"  // Budget Smartphone Price Index
  | "ECI-SUP-VIT"  // Supplement Price Index
  | "ECI-SNK-MEN"  // Sneaker Supply Index
  | "ECI-ELC-VOL"  // Electronics Volatility Index
  | "ECI-FSN-DIS"  // Fashion Discount Index
  | null;          // Non-benchmark charts

/**
 * Mapping from benchmark codes to JSON file names
 */
export const BENCHMARK_TO_JSON: Record<string, string> = {
  "ECI-SMP-300": "smp-300",
  "ECI-SUP-VIT": "sup-vit",
  "ECI-SNK-MEN": "snk-men",
  "ECI-ELC-VOL": "elc-vol",
  "ECI-FSN-DIS": "fsn-dis",
};

// ============================================================================
// DATA TYPES
// ============================================================================

export interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ChartSeries {
  name: string;
  data: DataPoint[];
  color?: string;
}

export interface ChartMetadata {
  lastUpdated: string;
  dataSource: string;
  sampleSize?: string;
  methodology?: string;
}

// ============================================================================
// JSON DATA STRUCTURE
// ============================================================================

/**
 * Structure of JSON data files in lib/data/
 */
export interface ChartJsonData {
  series: ChartSeries[];
  metadata: {
    source: string;
    lastUpdated: string;
    sampleSize?: string;
    methodology?: string;
  };
}

// ============================================================================
// CHART DEFINITION
// ============================================================================

export interface ChartDefinition {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  category: ChartCategory;
  platforms: Platform[];
  previewMetric: string;
  yAxisLabel: string;
  xAxisLabel: string;
  chartType: "line" | "area" | "bar";
  metadata: ChartMetadata;
  featured?: boolean;
  
  // New fields for data source management
  dataSource: DataSourceType;
  benchmarkCode: BenchmarkCode;
  
  // Mock data generator (fallback)
  getMockSeries: () => ChartSeries[];
}

/**
 * Serializable chart data for client components
 * (without functions)
 */
export interface SerializableChartData {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  category: ChartCategory;
  platforms: Platform[];
  previewMetric: string;
  yAxisLabel: string;
  xAxisLabel: string;
  chartType: "line" | "area" | "bar";
  metadata: ChartMetadata;
  featured?: boolean;
  dataSource: DataSourceType;
  benchmarkCode: BenchmarkCode;
}

// ============================================================================
// FILTER & SEARCH
// ============================================================================

export interface ChartFilter {
  platforms?: Platform[];
  categories?: ChartCategory[];
  searchQuery?: string;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface NewsletterSubscription {
  email: string;
  source?: string;
}

export interface ChartsApiResponse {
  success: boolean;
  count: number;
  charts: Array<SerializableChartData & { series: ChartSeries[] }>;
}
