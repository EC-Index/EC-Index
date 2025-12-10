// app/api/charts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAllCharts, getChartsByFilter } from "../../../lib/services/chart-service";
import { ChartCategorySchema, PlatformSchema } from "@/lib/types/chart.types";
import { rateLimit } from "@/lib/utils/rate-limit";
import { RATE_LIMITS, CACHE_TIMES } from "@/lib/config/constants";

const FilterSchema = z.object({
  platforms: z.string().optional(),
  categories: z.string().optional(),
  search: z.string().optional(),
  featured: z.enum(["true", "false"]).optional(),
  sortBy: z.enum(["title", "updated", "category"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get("x-forwarded-for") || "anonymous";
    const rateLimitResult = rateLimit(`api:${ip}`, RATE_LIMITS.API);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Too many requests",
            code: "RATE_LIMIT_EXCEEDED",
          },
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMITS.API.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const validation = FilterSchema.safeParse({
      platforms: searchParams.get("platforms") || undefined,
      categories: searchParams.get("categories") || undefined,
      search: searchParams.get("search") || undefined,
      featured: searchParams.get("featured") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid query parameters",
            code: "VALIDATION_ERROR",
            details: validation.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const params = validation.data;

    // Parse filters
    const filter: any = {};

    if (params.platforms) {
      const platforms = params.platforms.split(",");
      const validPlatforms = platforms.filter((p) =>
        PlatformSchema.safeParse(p).success
      );
      if (validPlatforms.length > 0) {
        filter.platforms = validPlatforms;
      }
    }

    if (params.categories) {
      const categories = params.categories.split(",");
      const validCategories = categories.filter((c) =>
        ChartCategorySchema.safeParse(c).success
      );
      if (validCategories.length > 0) {
        filter.categories = validCategories;
      }
    }

    if (params.search) {
      filter.searchQuery = params.search;
    }

    if (params.featured === "true") {
      filter.featured = true;
    }

    // Get charts
    const charts =
      Object.keys(filter).length > 0
        ? getChartsByFilter(filter)
        : getAllCharts();

    // Sort if requested
    let sortedCharts = [...charts];
    if (params.sortBy) {
      sortedCharts.sort((a, b) => {
        switch (params.sortBy) {
          case "title":
            return a.title.localeCompare(b.title);
          case "updated":
            return (
              new Date(b.metadata.lastUpdated).getTime() -
              new Date(a.metadata.lastUpdated).getTime()
            );
          case "category":
            return a.category.localeCompare(b.category);
          default:
            return 0;
        }
      });
    }

    // Transform to API response (remove functions)
    const chartsData = sortedCharts.map((chart) => ({
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

    return NextResponse.json(
      {
        success: true,
        data: {
          charts: chartsData,
          count: chartsData.length,
        },
        meta: {
          timestamp: new Date().toISOString(),
          filters: filter,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_TIMES.API}, stale-while-revalidate`,
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      }
    );
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