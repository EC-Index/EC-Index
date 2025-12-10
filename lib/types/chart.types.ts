import { z } from "zod";

export const PlatformSchema = z.enum([
  "amazon",
  "ebay",
  "temu",
  "shein",
  "idealo",
  "geizhals",
  "check24",
  "other",
]);

export type Platform = z.infer<typeof PlatformSchema>;

export const ChartCategorySchema = z.enum([
  "prices",
  "supply",
  "demand",
  "discounts",
  "market-share",
  "volatility",
  "listings",
  "concentration",
]);

export type ChartCategory = z.infer<typeof ChartCategorySchema>;

export const TimeRangeSchema = z.enum(["7d", "30d", "90d", "6m", "1y", "2y", "all"]);

export type TimeRange = z.infer<typeof TimeRangeSchema>;

export interface DataPoint {
  date: string;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface ChartSeries {
  id: string;
  name: string;
  data: DataPoint[];
  color?: string;
  type?: "line" | "area" | "bar";
}

export interface ChartMetadata {
  lastUpdated: string;
  dataSource: string;
  sampleSize?: string;
  methodology?: string;
  updateFrequency?: string;
  dataQuality?: "high" | "medium" | "low";
}

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
  tags?: string[];
  relatedCharts?: string[];
  dataLoader: (timeRange?: TimeRange) => Promise<ChartSeries[]> | ChartSeries[];
}

export interface ChartFilter {
  platforms?: Platform[];
  categories?: ChartCategory[];
  searchQuery?: string;
  featured?: boolean;
  sortBy?: "title" | "updated" | "category";
}

export interface ChartPageData {
  chart: ChartDefinition;
  series: ChartSeries[];
  relatedCharts?: ChartDefinition[];
}