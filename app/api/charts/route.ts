// app/api/charts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAllCharts, getChartsByFilter } from "@/lib/charts";
import { ChartFilter, Platform, ChartCategory } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse filter parameters
    const filter: ChartFilter = {};

    const platformsParam = searchParams.get("platforms");
    if (platformsParam) {
      filter.platforms = platformsParam.split(",") as Platform[];
    }

    const categoriesParam = searchParams.get("categories");
    if (categoriesParam) {
      filter.categories = categoriesParam.split(",") as ChartCategory[];
    }

    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      filter.searchQuery = searchQuery;
    }

    // Get charts based on filter
    const charts =
      Object.keys(filter).length > 0
        ? getChartsByFilter(filter)
        : getAllCharts();

    // Map to API response format (excluding the getMockSeries function)
    const chartsData = charts.map((chart) => ({
      id: chart.id,
      slug: chart.slug,
      title: chart.title,
      shortDescription: chart.shortDescription,
      longDescription: chart.longDescription,
      category: chart.category,
      platforms: chart.platforms,
      previewMetric: chart.previewMetric,
      yAxisLabel: chart.yAxisLabel,
      xAxisLabel: chart.xAxisLabel,
      chartType: chart.chartType,
      metadata: chart.metadata,
      featured: chart.featured,
      // Generate mock series data
      series: chart.getMockSeries(),
    }));

    return NextResponse.json({
      success: true,
      count: chartsData.length,
      charts: chartsData,
    });
  } catch (error) {
    console.error("Charts API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}