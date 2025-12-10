// lib/charts.ts
/**
 * EC-Index Chart Definitions
 * 
 * Contains all chart definitions including:
 * - 5 Official EC-Index Benchmarks (with benchmarkCode)
 * - Additional analytical charts
 * 
 * Data Source Types:
 * - "json": Real data from JSON files (lib/data/)
 * - "mock": Generated mock data
 */

import {
  ChartDefinition,
  ChartSeries,
  DataPoint,
  ChartFilter,
  Platform,
  DataSourceType,
  BenchmarkCode,
} from "./types";

// ============================================================================
// MOCK DATA GENERATOR
// ============================================================================

function generateMockTimeSeries(
  months: number,
  baseValue: number,
  trend: "up" | "down" | "stable" | "volatile" = "stable",
  intervalDays: number = 7
): DataPoint[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const dates: Date[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + intervalDays);
  }

  const dataPoints: DataPoint[] = [];
  let currentValue = baseValue;
  const trendMultiplier = trend === "up" ? 1.002 : trend === "down" ? 0.998 : 1;

  dates.forEach((date) => {
    const noise = (Math.random() - 0.5) * 2 * (currentValue * (trend === "volatile" ? 0.1 : 0.03));
    currentValue = currentValue * trendMultiplier + noise;
    currentValue = Math.max(0, currentValue);

    dataPoints.push({
      date: date.toISOString().split("T")[0],
      value: currentValue,
    });
  });

  return dataPoints;
}

// ============================================================================
// OFFICIAL EC-INDEX BENCHMARKS
// ============================================================================

/**
 * ECI-SMP-300: Budget Smartphone Price Index
 */
const ECI_SMP_300: ChartDefinition = {
  id: "eci-smp-300",
  slug: "electronics-pricing-trend",
  title: "Budget Smartphone Price Index (ECI-SMP-300)",
  shortDescription: "Average price for smartphones under €300 on major German marketplaces",
  longDescription: "The ECI-SMP-300 measures weekly price trends for budget smartphones (new devices under €300) on Amazon, eBay, and Idealo. The index shows long-term price trends and seasonal patterns in the German smartphone market. Excludes refurbished devices, B-stock, and display items.",
  category: "prices",
  platforms: ["amazon", "ebay", "idealo"],
  previewMetric: "Avg Price (EUR)",
  yAxisLabel: "Average Price (EUR)",
  xAxisLabel: "Date",
  chartType: "line",
  featured: true,
  dataSource: "json",
  benchmarkCode: "ECI-SMP-300",
  metadata: {
    lastUpdated: new Date().toISOString(),
    dataSource: "Public marketplace data (Amazon DE, eBay DE, Idealo)",
    sampleSize: "~5,000 products per week",
    methodology: "Weekly weighted average of listing prices for new smartphones under €300. Weighted by sales rank. Excludes refurbished and B-stock.",
  },
  getMockSeries: () => [
    { name: "Amazon", data: generateMockTimeSeries(24, 245, "down"), color: "#FF9900" },
    { name: "eBay", data: generateMockTimeSeries(24, 235, "stable"), color: "#E53238" },
    { name: "Idealo", data: generateMockTimeSeries(24, 240, "down"), color: "#0066CC" },
  ],
};

/**
 * ECI-SUP-VIT: Supplement Price Index
 */
const ECI_SUP_VIT: ChartDefinition = {
  id: "eci-sup-vit",
  slug: "supplement-prices-ebay",
  title: "Supplement Price Index (ECI-SUP-VIT)",
  shortDescription: "Average price for dietary supplements on eBay Germany",
  longDescription: "The ECI-SUP-VIT tracks price trends for dietary supplements and vitamins on eBay Germany. The index focuses on the top 20 supplement categories and shows seasonal demand fluctuations and price trends. All prices are normalized to standard dosages.",
  category: "prices",
  platforms: ["ebay"],
  previewMetric: "Avg Price (EUR)",
  yAxisLabel: "Average Price (EUR)",
  xAxisLabel: "Date",
  chartType: "area",
  featured: true,
  dataSource: "json",
  benchmarkCode: "ECI-SUP-VIT",
  metadata: {
    lastUpdated: new Date().toISOString(),
    dataSource: "eBay Germany public listings",
    sampleSize: "~2,500 products per week",
    methodology: "Weekly average of normalized prices for top 20 supplement categories. Commercial sellers with >100 ratings only. Prices normalized to standard dosage per unit.",
  },
  getMockSeries: () => [
    { name: "Supplements", data: generateMockTimeSeries(24, 28.5, "up"), color: "#10B981" },
  ],
};

/**
 * ECI-SNK-MEN: Sneaker Supply Index
 */
const ECI_SNK_MEN: ChartDefinition = {
  id: "eci-snk-men",
  slug: "sneaker-listings-volume",
  title: "Sneaker Supply Index (ECI-SNK-MEN)",
  shortDescription: "Number of active men's sneaker listings on major marketplaces",
  longDescription: "The ECI-SNK-MEN measures weekly supply of men's sneakers across multiple platforms. The index shows market dynamics, seller activity, and seasonal fluctuations in the German sneaker market. Only fixed-price listings are evaluated, no auctions.",
  category: "supply",
  platforms: ["amazon", "ebay", "other"],
  previewMetric: "Active Listings",
  yAxisLabel: "Number of Listings",
  xAxisLabel: "Date",
  chartType: "line",
  featured: true,
  dataSource: "json",
  benchmarkCode: "ECI-SNK-MEN",
  metadata: {
    lastUpdated: new Date().toISOString(),
    dataSource: "Multi-platform public data",
    sampleSize: "~50,000 listings per week",
    methodology: "Weekly count of active fixed-price listings in men's sneaker category. Duplicate detection and exclusion of obvious counterfeits.",
  },
  getMockSeries: () => [
    { name: "Amazon", data: generateMockTimeSeries(24, 15200, "up"), color: "#FF9900" },
    { name: "eBay", data: generateMockTimeSeries(24, 22400, "stable"), color: "#E53238" },
    { name: "Other", data: generateMockTimeSeries(24, 8500, "up"), color: "#6B7280" },
  ],
};

/**
 * ECI-ELC-VOL: Electronics Volatility Index (NEW)
 */
const ECI_ELC_VOL: ChartDefinition = {
  id: "eci-elc-vol",
  slug: "electronics-volatility",
  title: "Electronics Volatility Index (ECI-ELC-VOL)",
  shortDescription: "Price volatility in key electronics categories across marketplaces",
  longDescription: "The ECI-ELC-VOL measures price fluctuations (standard deviation) for major electronics categories including smartphones, tablets, laptops, and accessories. Higher values indicate more volatile pricing. Useful for identifying promotional periods and market instability.",
  category: "volatility",
  platforms: ["amazon", "ebay", "idealo"],
  previewMetric: "Volatility Index",
  yAxisLabel: "Volatility (%)",
  xAxisLabel: "Date",
  chartType: "line",
  featured: true,
  dataSource: "mock", // Will be "json" when data is ready
  benchmarkCode: "ECI-ELC-VOL",
  metadata: {
    lastUpdated: new Date().toISOString(),
    dataSource: "Multi-platform price data",
    sampleSize: "~20,000 products",
    methodology: "Rolling 30-day standard deviation of daily price changes, normalized to percentage. Covers smartphones, tablets, laptops, and major accessories.",
  },
  getMockSeries: () => [
    { name: "Electronics Volatility", data: generateMockTimeSeries(24, 12.5, "volatile"), color: "#EF4444" },
  ],
};

/**
 * ECI-FSN-DIS: Fashion Discount Index (NEW)
 */
const ECI_FSN_DIS: ChartDefinition = {
  id: "eci-fsn-dis",
  slug: "fashion-discount-index",
  title: "Fashion Discount Index (ECI-FSN-DIS)",
  shortDescription: "Average discount levels in fashion categories across platforms",
  longDescription: "The ECI-FSN-DIS tracks average discount levels (% off original price) for fashion items on major marketplaces. Shows promotional strategies, seasonal sales patterns, and competitive pricing dynamics between platforms.",
  category: "discounts",
  platforms: ["amazon", "ebay", "shein"],
  previewMetric: "Avg Discount %",
  yAxisLabel: "Discount (%)",
  xAxisLabel: "Date",
  chartType: "bar",
  featured: true,
  dataSource: "mock", // Will be "json" when data is ready
  benchmarkCode: "ECI-FSN-DIS",
  metadata: {
    lastUpdated: new Date().toISOString(),
    dataSource: "Public listing data with original prices",
    sampleSize: "~15,000 fashion items",
    methodology: "Weekly average of advertised discounts. Only items with visible original price. Weighted by estimated sales volume.",
  },
  getMockSeries: () => [
    { name: "Amazon Fashion", data: generateMockTimeSeries(12, 22, "volatile", 30), color: "#FF9900" },
    { name: "eBay Fashion", data: generateMockTimeSeries(12, 18, "stable", 30), color: "#E53238" },
    { name: "Shein", data: generateMockTimeSeries(12, 35, "volatile", 30), color: "#EC4899" },
  ],
};

// ============================================================================
// ADDITIONAL ANALYTICAL CHARTS (Non-Benchmark)
// ============================================================================

const PLATFORM_COMPARISON: ChartDefinition = {
  id: "platform-comparison",
  slug: "platform-price-comparison",
  title: "Cross-Platform Price Comparison",
  shortDescription: "Price comparison of equivalent product categories across platforms",
  longDescription: "Compares average prices for equivalent product categories on Amazon, eBay, Temu, and Shein. Shows which platform is typically cheapest for various product types.",
  category: "prices",
  platforms: ["amazon", "ebay", "temu", "shein"],
  previewMetric: "Price Index",
  yAxisLabel: "Price Index (100 = Baseline)",
  xAxisLabel: "Date",
  chartType: "line",
  featured: false,
  dataSource: "mock",
  benchmarkCode: null,
  metadata: {
    lastUpdated: new Date().toISOString(),
    dataSource: "Public marketplace data",
    sampleSize: "~10,000 comparable products",
    methodology: "Normalized price index for equivalent product categories across platforms.",
  },
  getMockSeries: () => [
    { name: "Amazon", data: generateMockTimeSeries(24, 100, "stable"), color: "#FF9900" },
    { name: "eBay", data: generateMockTimeSeries(24, 95, "stable"), color: "#E53238" },
    { name: "Temu", data: generateMockTimeSeries(24, 72, "up"), color: "#F97316" },
    { name: "Shein", data: generateMockTimeSeries(24, 68, "stable"), color: "#EC4899" },
  ],
};

const NEW_LISTINGS_TECH: ChartDefinition = {
  id: "new-listings-tech",
  slug: "new-listings-tech",
  title: "New Tech Product Listings per Week",
  shortDescription: "Weekly volume of new product listings in technology categories",
  longDescription: "Measures the rate of new product listings in technology categories. Shows market activity and seller behavior patterns.",
  category: "listings",
  platforms: ["amazon", "ebay", "other"],
  previewMetric: "New Listings/Week",
  yAxisLabel: "Number of New Listings",
  xAxisLabel: "Date",
  chartType: "bar",
  featured: false,
  dataSource: "mock",
  benchmarkCode: null,
  metadata: {
    lastUpdated: new Date().toISOString(),
    dataSource: "Multi-platform listing data",
    sampleSize: "All new tech listings",
    methodology: "Weekly count of newly created listings in technology categories.",
  },
  getMockSeries: () => [
    { name: "New Listings", data: generateMockTimeSeries(24, 3450, "stable"), color: "#3B82F6" },
  ],
};

const BESTSELLER_CONCENTRATION: ChartDefinition = {
  id: "bestseller-concentration",
  slug: "bestseller-concentration",
  title: "Bestseller Concentration Index",
  shortDescription: "Share of top 10% products in total revenue",
  longDescription: "Measures market concentration by tracking the revenue share of top 10% bestsellers. Higher values indicate more concentrated markets with winner-take-all dynamics.",
  category: "concentration",
  platforms: ["amazon", "ebay"],
  previewMetric: "Concentration %",
  yAxisLabel: "Top 10% Revenue Share (%)",
  xAxisLabel: "Date",
  chartType: "area",
  featured: false,
  dataSource: "mock",
  benchmarkCode: null,
  metadata: {
    lastUpdated: new Date().toISOString(),
    dataSource: "Public sales rank data",
    sampleSize: "~30,000 products",
    methodology: "Estimated revenue concentration based on bestseller rankings.",
  },
  getMockSeries: () => [
    { name: "Concentration", data: generateMockTimeSeries(24, 68, "up"), color: "#8B5CF6" },
  ],
};

// ============================================================================
// EXPORTS
// ============================================================================

export const CHART_DEFINITIONS: ChartDefinition[] = [
  // Official Benchmarks (featured)
  ECI_SMP_300,
  ECI_SUP_VIT,
  ECI_SNK_MEN,
  ECI_ELC_VOL,
  ECI_FSN_DIS,
  // Additional Charts
  PLATFORM_COMPARISON,
  NEW_LISTINGS_TECH,
  BESTSELLER_CONCENTRATION,
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getAllCharts(): ChartDefinition[] {
  return CHART_DEFINITIONS;
}

export function getFeaturedCharts(): ChartDefinition[] {
  return CHART_DEFINITIONS.filter((chart) => chart.featured);
}

export function getChartBySlug(slug: string): ChartDefinition | undefined {
  return CHART_DEFINITIONS.find((chart) => chart.slug === slug);
}

export function getChartById(id: string): ChartDefinition | undefined {
  return CHART_DEFINITIONS.find((chart) => chart.id === id);
}

export function getChartsByFilter(filter: ChartFilter): ChartDefinition[] {
  let filtered = CHART_DEFINITIONS;

  if (filter.platforms && filter.platforms.length > 0) {
    filtered = filtered.filter((chart) =>
      chart.platforms.some((p) => filter.platforms?.includes(p))
    );
  }

  if (filter.categories && filter.categories.length > 0) {
    filtered = filtered.filter((chart) =>
      filter.categories?.includes(chart.category)
    );
  }

  if (filter.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (chart) =>
        chart.title.toLowerCase().includes(query) ||
        chart.shortDescription.toLowerCase().includes(query)
    );
  }

  return filtered;
}

export function getBenchmarkCharts(): ChartDefinition[] {
  return CHART_DEFINITIONS.filter((chart) => chart.benchmarkCode !== null);
}

export function getAllPlatforms(): Platform[] {
  const platforms = new Set<Platform>();
  CHART_DEFINITIONS.forEach((chart) => {
    chart.platforms.forEach((p) => platforms.add(p));
  });
  return Array.from(platforms);
}

export function getPlatformDisplayName(platform: Platform): string {
  const names: Record<Platform, string> = {
    amazon: "Amazon",
    ebay: "eBay",
    temu: "Temu",
    shein: "Shein",
    idealo: "Idealo",
    geizhals: "Geizhals",
    check24: "Check24",
    other: "Other",
  };
  return names[platform];
}

export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    prices: "Prices",
    supply: "Supply",
    demand: "Demand",
    discounts: "Discounts",
    "market-share": "Market Share",
    volatility: "Volatility",
    listings: "Listings",
    concentration: "Concentration",
  };
  return names[category] || category;
}
