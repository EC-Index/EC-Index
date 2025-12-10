import { ChartSeries, DataPoint, TimeRange } from "@/lib/types/chart.types";
import { addNoise, generateDateRange } from "@/lib/utils/date";
import { PLATFORM_COLORS } from "@/lib/config/constants";

type TrendType = "up" | "down" | "stable" | "volatile";

export function generateMockSeries(
  chartId: string,
  timeRange: TimeRange = "1y"
): ChartSeries[] {
  // Return chart-specific series based on chartId
  switch (chartId) {
    case "electronics-pricing-trend":
      return [
        generateMockTimeSeries("amazon", "Amazon", 245, "down", timeRange),
        generateMockTimeSeries("ebay", "eBay", 235, "stable", timeRange),
        generateMockTimeSeries("idealo", "Idealo", 240, "down", timeRange),
      ];
    case "supplement-prices-ebay":
      return [
        generateMockTimeSeries("ebay", "Average Price", 28.5, "up", timeRange),
      ];
    case "sneaker-listings-volume":
      return [
        generateMockTimeSeries("amazon", "Amazon", 15200, "up", timeRange),
        generateMockTimeSeries("ebay", "eBay", 22400, "stable", timeRange),
        generateMockTimeSeries("other", "Other", 8500, "up", timeRange),
      ];
    case "electronics-price-volatility":
      return [
        generateMockTimeSeries("", "Volatility", 12.5, "volatile", timeRange),
      ];
    case "platform-price-comparison":
      return [
        generateMockTimeSeries("amazon", "Amazon", 100, "stable", timeRange),
        generateMockTimeSeries("ebay", "eBay", 95, "stable", timeRange),
        generateMockTimeSeries("temu", "Temu", 72, "up", timeRange),
        generateMockTimeSeries("shein", "Shein", 68, "stable", timeRange),
      ];
    case "discount-heatmap-fashion":
      return [
        generateMockTimeSeries("amazon", "Amazon", 22, "volatile", timeRange, 30),
        generateMockTimeSeries("ebay", "eBay", 18, "stable", timeRange, 30),
        generateMockTimeSeries("shein", "Shein", 35, "volatile", timeRange, 30),
      ];
    case "new-listings-tech":
      return [
        generateMockTimeSeries("", "New Listings", 3450, "stable", timeRange),
      ];
    case "bestseller-concentration":
      return [
        generateMockTimeSeries("", "Concentration", 68, "up", timeRange),
      ];
    default:
      return [generateMockTimeSeries("", "Sample Data", 100, "stable", timeRange)];
  }
}

function generateMockTimeSeries(
  platformId: string,
  name: string,
  baseValue: number,
  trend: TrendType,
  timeRange: TimeRange,
  intervalDays: number = 7
): ChartSeries {
  const months = getMonthsFromTimeRange(timeRange);
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const dates = generateDateRange(startDate, endDate, intervalDays);
  const dataPoints: DataPoint[] = [];

  let currentValue = baseValue;
  const trendMultiplier = trend === "up" ? 1.002 : trend === "down" ? 0.998 : 1;

  dates.forEach((date) => {
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

  return {
    id: `${platformId}-${name}`.toLowerCase().replace(/\s+/g, "-"),
    name,
    data: dataPoints,
    color: platformId ? PLATFORM_COLORS[platformId] : undefined,
  };
}

function getMonthsFromTimeRange(timeRange: TimeRange): number {
  const mapping: Record<TimeRange, number> = {
    "7d": 0.25,
    "30d": 1,
    "90d": 3,
    "6m": 6,
    "1y": 12,
    "2y": 24,
    all: 24,
  };
  return mapping[timeRange] || 12;
}