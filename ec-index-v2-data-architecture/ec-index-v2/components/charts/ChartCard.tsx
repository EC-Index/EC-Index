"use client";

// components/charts/ChartCard.tsx
/**
 * ChartCard Component
 * 
 * Displays a preview card for a chart in the grid view.
 */

import Link from "next/link";
import { ChartSeries } from "../../lib/types";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import Tag from "../common/Tag";
import Badge from "../common/Badge";

interface ChartCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  platforms: string[];
  chartType: "line" | "area" | "bar";
  previewMetric: string;
  series: ChartSeries[];
  featured?: boolean;
  benchmarkCode?: string | null;
}

export default function ChartCard({
  slug,
  title,
  shortDescription,
  category,
  platforms,
  chartType,
  previewMetric,
  series,
  featured,
  benchmarkCode,
}: ChartCardProps) {
  // Prepare preview data (last 12 points)
  const previewData = series[0]?.data.slice(-12).map((d, idx) => ({
    idx,
    value: d.value,
  })) || [];

  // Calculate trend
  const firstValue = previewData[0]?.value || 0;
  const lastValue = previewData[previewData.length - 1]?.value || 0;
  const trendPercent = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
  const isPositive = trendPercent >= 0;

  // Clean title (remove benchmark code for display)
  const displayTitle = title.replace(/\s*\([^)]+\)$/, "");

  return (
    <Link href={`/charts/${slug}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-wrap gap-2 mb-3">
          {benchmarkCode && (
            <Badge variant="featured" className="text-xs">
              {benchmarkCode}
            </Badge>
          )}
          {platforms.slice(0, 2).map((platform) => (
            <Tag key={platform} variant="platform" className="text-xs">
              {platform}
            </Tag>
          ))}
          {platforms.length > 2 && (
            <Tag variant="default" className="text-xs">
              +{platforms.length - 2}
            </Tag>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {displayTitle}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {shortDescription}
        </p>

        {/* Preview Chart */}
        <div className="h-16 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={previewData}>
                <defs>
                  <linearGradient id={`gradient-${slug}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? "#10B981" : "#EF4444"}
                  fill={`url(#gradient-${slug})`}
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <LineChart data={previewData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? "#10B981" : "#EF4444"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">{previewMetric}</span>
          <span
            className={`text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {trendPercent.toFixed(1)}%
          </span>
        </div>
      </div>
    </Link>
  );
}
