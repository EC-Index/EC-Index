// lib/charts.ts

import {
  ChartDefinition,
  ChartSeries,
  DataPoint,
  ChartFilter,
  Platform,
} from "./types";
import { generateDateRange, randomInRange, addNoise } from "./utils";

/**
 * Generate mock time-series data
 */
function generateMockTimeSeries(
  months: number,
  baseValue: number,
  trend: "up" | "down" | "stable" | "volatile" = "stable",
  intervalDays: number = 7
): DataPoint[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const dates = generateDateRange(startDate, endDate, intervalDays);
  const dataPoints: DataPoint[] = [];

  let currentValue = baseValue;
  const trendMultiplier = trend === "up" ? 1.002 : trend === "down" ? 0.998 : 1;
  const volatilityMultiplier = trend === "volatile" ? 1.05 : 1.02;

  dates.forEach((date, index) => {
    if (trend === "volatile") {
      currentValue = addNoise(currentValue, 10);
    } else {
      currentValue = addNoise(currentValue * trendMultiplier, 3);
    }

    dataPoints.push({
      date: date.toISOString().split("T")[0],
      value: Math.max(0, currentValue),
    });
  });

  return dataPoints;
}

/**
 * All chart definitions
 */
export const CHART_DEFINITIONS: ChartDefinition[] = [
  {
    id: "electronics-pricing-trend",
    slug: "electronics-pricing-trend",
    title: "Smartphone Price Trends (Under €300)",
    shortDescription:
      "Average price development for smartphones under €300 across major marketplaces",
    longDescription:
      "This chart tracks the average pricing for budget smartphones (under €300) across Amazon, eBay, and other platforms. Data shows seasonal patterns and platform-specific pricing strategies.",
    category: "prices",
    platforms: ["amazon", "ebay", "idealo"],
    previewMetric: "Average Price",
    yAxisLabel: "Price (EUR)",
    xAxisLabel: "Date",
    chartType: "line",
    featured: true,
    metadata: {
      lastUpdated: new Date().toISOString(),
      dataSource: "Public marketplace data",
      sampleSize: "~5,000 products",
      methodology: "Weekly average of listed prices for smartphones under €300",
    },
    getMockSeries: () => [
      {
        name: "Amazon",
        data: generateMockTimeSeries(24, 245, "down"),
        color: "#FF9900",
      },
      {
        name: "eBay",
        data: generateMockTimeSeries(24, 235, "stable"),
        color: "#E53238",
      },
      {
        name: "Idealo",
        data: generateMockTimeSeries(24, 240, "down"),
        color: "#0066CC",
      },
    ],
  },
  {
    id: "supplement-prices-ebay",
    slug: "supplement-prices-ebay",
    title: "Supplement Price Development on eBay",
    shortDescription:
      "Average price trends for health supplements and vitamins on eBay",
    longDescription:
      "Tracking the average prices of popular health supplements and vitamin products on eBay. Shows seasonal demand patterns and price fluctuations.",
    category: "prices",
    platforms: ["ebay"],
    previewMetric: "Average Price",
    yAxisLabel: "Price (EUR)",
    xAxisLabel: "Date",
    chartType: "area",
    featured: true,
    metadata: {
      lastUpdated: new Date().toISOString(),
      dataSource: "eBay public listings",
      sampleSize: "~2,500 products",
      methodology: "Weekly average of supplement listings",
    },
    getMockSeries: () => [
      {
        name: "Average Supplement Price",
        data: generateMockTimeSeries(24, 28.5, "up"),
        color: "#10B981",
      },
    ],
  },
  {
    id: "sneaker-listings-volume",
    slug: "sneaker-listings-volume",
    title: "Men's Sneaker Listings Volume",
    shortDescription:
      "Number of active sneaker listings across multiple marketplaces",
    longDescription:
      "Tracks the total number of men's sneaker listings across major platforms. Useful for understanding market supply and seller activity.",
    category: "supply",
    platforms: ["amazon", "ebay", "other"],
    previewMetric: "Active Listings",
    yAxisLabel: "Number of Listings",
    xAxisLabel: "Date",
    chartType: "line",
    featured: true,
    metadata: {
      lastUpdated: new Date().toISOString(),
      dataSource: "Multi-platform public data",
      sampleSize: "~50,000 listings",
      methodology: "Weekly count of active listings in men's sneaker category",
    },
    getMockSeries: () => [
      {
        name: "Amazon",
        data: generateMockTimeSeries(24, 15200, "up"),
        color: "#FF9900",
      },
      {
        name: "eBay",
        data: generateMockTimeSeries(24, 22400, "stable"),
        color: "#E53238",
      },
      {
        name: "Other Platforms",
        data: generateMockTimeSeries(24, 8500, "up"),
        color: "#6B7280",
      },
    ],
  },
  {
    id: "electronics-price-volatility",
    slug: "electronics-price-volatility",
    title: "Electronics Price Volatility Index",
    shortDescription:
      "Price volatility across major electronics categories",
    longDescription:
      "Measures price fluctuation (standard deviation) for major electronics categories. Higher values indicate more volatile pricing.",
    category: "volatility",
    platforms: ["amazon", "ebay", "idealo"],
    previewMetric: "Volatility Index",
    yAxisLabel: "Volatility Index (%)",
    xAxisLabel: "Date",
    chartType: "line",
    featured: true,
    metadata: {
      lastUpdated: new Date().toISOString(),
      dataSource: "Multi-platform price data",
      sampleSize: "~20,000 products",
      methodology:
        "Rolling 30-day standard deviation of daily price changes",
    },
    getMockSeries: () => [
      {
        name: "Volatility",
        data: generateMockTimeSeries(24, 12.5, "volatile"),
        color: "#EF4444",
      },
    ],
  },
  {
    id: "platform-price-comparison",
    slug: "platform-price-comparison",
    title: "Cross-Platform Price Comparison",
    shortDescription:
      "Average price comparison for same product categories across platforms",
    longDescription:
      "Compares average prices for equivalent product categories across Amazon, eBay, Temu, and Shein. Shows which platform typically offers lower prices.",
    category: "prices",
    platforms: ["amazon", "ebay", "temu", "shein"],
    previewMetric: "Average Price Index",
    yAxisLabel: "Price Index (100 = baseline)",
    xAxisLabel: "Date",
    chartType: "line",
    featured: true,
    metadata: {
      lastUpdated: new Date().toISOString(),
      dataSource: "Public marketplace data",
      sampleSize: "~10,000 comparable products",
      methodology:
        "Normalized price index for equivalent product categories",
    },
    getMockSeries: () => [
      {
        name: "Amazon",
        data: generateMockTimeSeries(24, 100, "stable"),
        color: "#FF9900",
      },
      {
        name: "eBay",
        data: generateMockTimeSeries(24, 95, "stable"),
        color: "#E53238",
      },
      {
        name: "Temu",
        data: generateMockTimeSeries(24, 72, "up"),
        color: "#F97316",
      },
      {
        name: "Shein",
        data: generateMockTimeSeries(24, 68, "stable"),
        color: "#EC4899",
      },
    ],
  },
  {
    id: "discount-heatmap-fashion",
    slug: "discount-heatmap-fashion",
    title: "Fashion Discount Trends",
    shortDescription:
      "Average discount percentages in fashion category by platform",
    longDescription:
      "Tracks average discount levels (% off original price) for fashion items across major marketplaces. Useful for understanding promotional strategies.",
    category: "discounts",
    platforms: ["amazon", "ebay", "shein"],
    previewMetric: "Average Discount %",
    yAxisLabel: "Discount (%)",
    xAxisLabel: "Date",
    chartType: "bar",
    featured: true,
    metadata: {
      lastUpdated: new Date().toISOString(),
      dataSource: "Public listing data with original prices",
      sampleSize: "~15,000 fashion items",
      methodology: "Weekly average of advertised discount percentages",
    },
    getMockSeries: () => [
      {
        name: "Amazon Fashion",
        data: generateMockTimeSeries(12, 22, "volatile", 30),
        color: "#FF9900",
      },
      {
        name: "eBay Fashion",
        data: generateMockTimeSeries(12, 18, "stable", 30),
        color: "#E53238",
      },
      {
        name: "Shein",
        data: generateMockTimeSeries(12, 35, "volatile", 30),
        color: "#EC4899",
      },
    ],
  },
  {
    id: "new-listings-tech",
    slug: "new-listings-tech",
    title: "New Tech Product Listings per Week",
    shortDescription:
      "Weekly volume of new product listings in technology categories",
    longDescription:
      "Measures the rate of new product listings in technology categories. Useful for understanding market activity and seller behavior.",
    category: "listings",
    platforms: ["amazon", "ebay", "other"],
    previewMetric: "New Listings/Week",
    yAxisLabel: "Number of New Listings",
    xAxisLabel: "Date",
    chartType: "bar",
    featured: false,
    metadata: {
      lastUpdated: new Date().toISOString(),
      dataSource: "Multi-platform listing data",
      sampleSize: "All new tech listings",
      methodology: "Weekly count of newly created listings",
    },
    getMockSeries: () => [
      {
        name: "New Listings",
        data: generateMockTimeSeries(24, 3450, "stable"),
        color: "#3B82F6",
      },
    ],
  },
  {
    id: "bestseller-concentration",
    slug: "bestseller-concentration",
    title: "Bestseller Concentration Index",
    shortDescription:
      "Percentage of total sales captured by top 10% of products",
    longDescription:
      "Measures market concentration by tracking what percentage of total category sales are captured by the top 10% best-selling products. Higher values indicate more concentrated markets.",
    category: "concentration",
    platforms: ["amazon", "ebay"],
    previewMetric: "Concentration %",
    yAxisLabel: "Top 10% Sales Share (%)",
    xAxisLabel: "Date",
    chartType: "area",
    featured: false,
    metadata: {
      lastUpdated: new Date().toISOString(),
      dataSource: "Public sales rank data",
      sampleSize: "~30,000 products",
      methodology:
        "Estimated sales concentration based on bestseller rankings",
    },
    getMockSeries: () => [
      {
        name: "Concentration",
        data: generateMockTimeSeries(24, 68, "up"),
        color: "#8B5CF6",
      },
    ],
  },
];

/**
 * Get all charts
 */
export function getAllCharts(): ChartDefinition[] {
  return CHART_DEFINITIONS;
}

/**
 * Get featured charts for homepage
 */
export function getFeaturedCharts(): ChartDefinition[] {
  return CHART_DEFINITIONS.filter((chart) => chart.featured);
}

/**
 * Get chart by slug
 */
export function getChartBySlug(slug: string): ChartDefinition | undefined {
  return CHART_DEFINITIONS.find((chart) => chart.slug === slug);
}

/**
 * Filter charts based on criteria
 */
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

/**
 * Get unique platforms from all charts
 */
export function getAllPlatforms(): Platform[] {
  const platforms = new Set<Platform>();
  CHART_DEFINITIONS.forEach((chart) => {
    chart.platforms.forEach((p) => platforms.add(p));
  });
  return Array.from(platforms);
}

/**
 * Get platform display name
 */
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

/**
 * Get category display name
 */
export function getCategoryDisplayName(
  category: string
): string {
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