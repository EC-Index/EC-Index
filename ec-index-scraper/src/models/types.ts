// src/models/types.ts
/**
 * EC-Index Data Collector - Type Definitions
 * 
 * Core data models for price collection across platforms.
 */

import { z } from "zod";

// ============================================================================
// PLATFORM DEFINITIONS
// ============================================================================

export const PlatformSchema = z.enum([
  "amazon",
  "ebay", 
  "idealo",
  "geizhals",
  "check24",
  "otto",
  "mediamarkt",
  "saturn",
  "other"
]);

export type Platform = z.infer<typeof PlatformSchema>;

// ============================================================================
// PRODUCT DATA
// ============================================================================

export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  brand: z.string().optional(),
  model: z.string().optional(),
  ean: z.string().optional(),
  category: z.string(),
  subcategory: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

// ============================================================================
// PRICE DATA POINT
// ============================================================================

export const PriceDataPointSchema = z.object({
  productId: z.string(),
  platform: PlatformSchema,
  price: z.number(),
  currency: z.string().default("EUR"),
  originalPrice: z.number().optional(), // For discount calculation
  shipping: z.number().optional(),
  seller: z.string().optional(),
  sellerRating: z.number().optional(),
  sellerReviewCount: z.number().optional(),
  condition: z.enum(["new", "refurbished", "used"]).default("new"),
  inStock: z.boolean().default(true),
  url: z.string().url(),
  collectedAt: z.string().datetime(),
});

export type PriceDataPoint = z.infer<typeof PriceDataPointSchema>;

// ============================================================================
// LISTING DATA (for supply indices)
// ============================================================================

export const ListingDataPointSchema = z.object({
  platform: PlatformSchema,
  category: z.string(),
  subcategory: z.string().optional(),
  listingCount: z.number(),
  newListingsCount: z.number().optional(),
  priceRange: z.object({
    min: z.number(),
    max: z.number(),
    median: z.number(),
  }).optional(),
  collectedAt: z.string().datetime(),
});

export type ListingDataPoint = z.infer<typeof ListingDataPointSchema>;

// ============================================================================
// AGGREGATED DATA (for indices)
// ============================================================================

export const AggregatedPriceSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  platform: PlatformSchema,
  category: z.string(),
  averagePrice: z.number(),
  medianPrice: z.number(),
  minPrice: z.number(),
  maxPrice: z.number(),
  sampleSize: z.number(),
  priceChange: z.number().optional(), // vs previous period
});

export type AggregatedPrice = z.infer<typeof AggregatedPriceSchema>;

// ============================================================================
// BENCHMARK DEFINITIONS
// ============================================================================

export interface BenchmarkConfig {
  code: string;
  name: string;
  category: string;
  platforms: Platform[];
  searchQueries: string[];
  priceFilter?: {
    min?: number;
    max?: number;
  };
  excludeKeywords?: string[];
  conditionFilter?: ("new" | "refurbished" | "used")[];
}

export const BENCHMARK_CONFIGS: Record<string, BenchmarkConfig> = {
  "ECI-SMP-300": {
    code: "ECI-SMP-300",
    name: "Budget Smartphone Price Index",
    category: "smartphones",
    platforms: ["amazon", "ebay", "idealo"],  // Amazon via DMA, eBay via API, Idealo public
    searchQueries: [
      "smartphone android",
      "smartphone 128gb",
      "xiaomi redmi",
      "samsung galaxy a",
      "motorola moto g",
      "realme smartphone",
      "poco smartphone",
      "xiaomi poco",
      "honor smartphone",
      "oppo smartphone",
    ],
    priceFilter: { min: 100, max: 300 },
    excludeKeywords: ["hülle", "case", "folie", "ladegerät", "kabel", "refurbished", "gebraucht", "defekt", "display", "akku"],
    conditionFilter: ["new"],
  },
  "ECI-SUP-VIT": {
    code: "ECI-SUP-VIT",
    name: "Supplement Price Index",
    category: "supplements",
    platforms: ["amazon", "ebay"],  // Amazon + eBay sind Hauptquellen für Supplements
    searchQueries: [
      "vitamin d3 tabletten",
      "vitamin d3 tropfen",
      "omega 3 kapseln",
      "omega 3 fischöl",
      "magnesium tabletten",
      "magnesium citrat",
      "zink tabletten",
      "vitamin c 1000mg",
      "vitamin b12",
      "vitamin b komplex",
      "multivitamin",
      "kreatin monohydrat",
      "whey protein isolat",
      "kollagen pulver",
    ],
    priceFilter: { min: 5, max: 80 },
    excludeKeywords: ["probe", "sample", "mini", "einzeln", "1 stück"],
    conditionFilter: ["new"],
  },
  "ECI-SNK-MEN": {
    code: "ECI-SNK-MEN",
    name: "Sneaker Supply Index",
    category: "sneakers",
    platforms: ["amazon", "ebay", "idealo"],
    searchQueries: [
      "herren sneaker",
      "nike air max herren",
      "nike air force herren",
      "adidas sneaker herren",
      "adidas superstar herren",
      "adidas stan smith",
      "puma sneaker herren",
      "new balance 574",
      "new balance 530",
      "converse chuck taylor",
      "vans old skool",
      "reebok classic",
    ],
    priceFilter: { min: 40, max: 200 },
    excludeKeywords: ["kinder", "damen", "socken", "schnürsenkel", "einlagen"],
    conditionFilter: ["new"],
  },
};

// ============================================================================
// COLLECTION RESULT
// ============================================================================

export interface CollectionResult {
  benchmark: string;
  platform: Platform;
  startTime: string;
  endTime: string;
  totalProducts: number;
  validProducts: number;
  errors: string[];
  dataPoints: PriceDataPoint[];
}

// ============================================================================
// EXPORT FORMAT (for website JSON)
// ============================================================================

export interface ExportSeriesData {
  name: string;
  color: string;
  data: Array<{ date: string; value: number }>;
}

export interface ExportJsonFormat {
  series: ExportSeriesData[];
  metadata: {
    source: string;
    lastUpdated: string;
    sampleSize: string;
    methodology: string;
  };
}
