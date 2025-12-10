// lib/types.ts

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

export interface DataPoint {
  date: string; // ISO date string
  value: number;
  label?: string;
}

export interface ChartSeries {
  name: string;
  data: DataPoint[];
  color?: string;
}

export interface ChartMetadata {
  lastUpdated: string; // ISO date string
  dataSource: string;
  sampleSize?: string;
  methodology?: string;
}

export interface ChartDefinition {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  category: ChartCategory;
  platforms: Platform[];
  previewMetric: string; // e.g., "Average price (EUR)", "Product count"
  yAxisLabel: string;
  xAxisLabel: string;
  chartType: "line" | "area" | "bar";
  metadata: ChartMetadata;
  getMockSeries: () => ChartSeries[];
  featured?: boolean; // For homepage display
}

export interface ChartFilter {
  platforms?: Platform[];
  categories?: ChartCategory[];
  searchQuery?: string;
}

export interface NewsletterSubscription {
  email: string;
  source?: string; // e.g., "homepage", "pricing-page"
}