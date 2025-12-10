"use client";

// components/charts/ChartCard.tsx

import Link from "next/link";
import { ChartDefinition } from "@/lib/types";
import Tag from "@/components/common/Tag";
import Badge from "@/components/common/Badge";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartCardProps {
  chart: ChartDefinition;
}

export default function ChartCard({ chart }: ChartCardProps) {
  const series = chart.getMockSeries();
  const firstSeries = series[0];

  // Prepare data for preview chart (take last 12 points)
  const previewData = firstSeries.data.slice(-12).map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    value: point.value,
  }));

  // Render appropriate chart type
  const renderPreviewChart = () => {
    const commonProps = {
      width: "100%",
      height: 120,
      data: previewData,
    };

    const color = firstSeries.color || "#3B82F6";

    switch (chart.chartType) {
      case "area":
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={previewData}>
              <defs>
                <linearGradient id={`gradient-${chart.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={`url(#gradient-${chart.id})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={previewData}>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" fill={color} />
            </BarChart>
          </ResponsiveContainer>
        );
      default: // line
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={previewData}>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Link href={`/charts/${chart.slug}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group">
        {/* Header */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {chart.featured && <Badge variant="featured">Featured</Badge>}
            <Badge variant="category">{chart.category}</Badge>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {chart.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {chart.shortDescription}
          </p>
        </div>

        {/* Preview Chart */}
        <div className="mb-4 -mx-2">{renderPreviewChart()}</div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {chart.platforms.slice(0, 3).map((platform) => (
            <Tag key={platform} variant="platform">
              {platform}
            </Tag>
          ))}
          {chart.platforms.length > 3 && (
            <Tag variant="platform">+{chart.platforms.length - 3}</Tag>
          )}
        </div>

        {/* Metric */}
        <div className="text-sm text-gray-500">
          <span className="font-medium">{chart.previewMetric}</span>
        </div>
      </div>
    </Link>
  );
}
