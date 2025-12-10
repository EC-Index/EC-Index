// app/api/charts/route.ts

import { NextResponse } from "next/server";
import { getAllCharts } from "../../../lib/services/chart-service";

export async function GET() {
  try {
    const charts = getAllCharts();

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
      tags: chart.tags,
    }));

    return NextResponse.json({
      success: true,
      data: {
        charts: chartsData,
        count: chartsData.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Charts API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Internal server error",
          code: "INTERNAL_ERROR",
        },
      },
      { status: 500 }
    );
  }
}
