// lib/types.ts
/**
 * EC-Index Type Definitionen
 * 
 * Zentrale Typdefinitionen für das gesamte EC-Index Projekt.
 */

// ============================================================================
// PLATFORM & CATEGORY TYPES
// ============================================================================

/**
 * Unterstützte E-Commerce Plattformen
 */
export type Platform =
  | "amazon"
  | "ebay"
  | "temu"
  | "shein"
  | "idealo"
  | "geizhals"
  | "check24"
  | "other";

/**
 * Chart-Kategorien
 */
export type ChartCategory =
  | "prices"
  | "supply"
  | "demand"
  | "discounts"
  | "market-share"
  | "volatility"
  | "listings"
  | "concentration";

/**
 * Verfügbare Zeiträume für Chart-Filter
 */
export type TimeRange = "7d" | "30d" | "90d" | "1y" | "2y" | "all";

// ============================================================================
// DATA TYPES
// ============================================================================

/**
 * Einzelner Datenpunkt in einer Zeitreihe
 */
export interface DataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  value: number;
  label?: string;
}

/**
 * Eine Datenserie (z.B. eine Linie im Chart)
 */
export interface ChartSeries {
  name: string;
  data: DataPoint[];
  color?: string;
}

/**
 * Metadaten zu einem Chart
 */
export interface ChartMetadata {
  lastUpdated: string; // ISO date string
  dataSource: string;
  sampleSize?: string;
  methodology?: string;
}

// ============================================================================
// CHART DEFINITION
// ============================================================================

/**
 * Vollständige Definition eines Charts
 */
export interface ChartDefinition {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  category: ChartCategory;
  platforms: Platform[];
  previewMetric: string; // z.B. "Ø Preis (EUR)", "Anzahl Listings"
  yAxisLabel: string;
  xAxisLabel: string;
  chartType: "line" | "area" | "bar";
  metadata: ChartMetadata;
  getMockSeries: () => ChartSeries[];
  featured?: boolean; // Für Homepage-Anzeige
}

// ============================================================================
// FILTER & SEARCH
// ============================================================================

/**
 * Filter-Kriterien für Charts
 */
export interface ChartFilter {
  platforms?: Platform[];
  categories?: ChartCategory[];
  searchQuery?: string;
}

// ============================================================================
// API TYPES
// ============================================================================

/**
 * Newsletter-Anmeldung
 */
export interface NewsletterSubscription {
  email: string;
  source?: string; // z.B. "homepage", "pricing-page"
}

/**
 * API Response für Charts
 */
export interface ChartsApiResponse {
  success: boolean;
  count: number;
  charts: Array<{
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
    series: ChartSeries[];
  }>;
}

// ============================================================================
// JSON DATA TYPES (für lib/data/*.json)
// ============================================================================

/**
 * Rohdatenformat für JSON-Dateien
 */
export interface RawDataPoint {
  date: string;
  platform?: string;
  value: number;
}

/**
 * Typ für importierte JSON-Daten
 */
export type ChartJsonData = RawDataPoint[];

// ============================================================================
// BENCHMARK TYPES
// ============================================================================

/**
 * Offizielle EC-Index Benchmark-Codes
 */
export type BenchmarkCode = 
  | "ECI-SMP-300"  // Budget Smartphone Price Index
  | "ECI-SUP-VIT"  // Supplement Price Index
  | "ECI-SNK-MEN"; // Sneaker Supply Index

/**
 * Mapping von Slugs zu Benchmark-Codes
 */
export const BENCHMARK_CODES: Record<string, BenchmarkCode> = {
  "electronics-pricing-trend": "ECI-SMP-300",
  "supplement-prices-ebay": "ECI-SUP-VIT",
  "sneaker-listings-volume": "ECI-SNK-MEN",
};
