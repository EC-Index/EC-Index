// components/charts/BaseChart.tsx

"use client";

import { ChartSeries } from "@/lib/types/chart.types";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/utils/format";

interface BaseChartProps {
  series: ChartSeries[];
  type: "line" | "area" | "bar";
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

export default function BaseChart({
  series,
  type,
  xAxisLabel,
  yAxisLabel,
  height = 400,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  formatValue = (v) => formatNumber(v, 2),
  className = "",
}: BaseChartProps) {
  const allDates = series[0]?.data.map((d) => d.date) || [];
  const chartData = allDates.map((date) => {
    const dataPoint: any = {
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      fullDate: date,
    };

    series.forEach((s) => {
      const point = s.data.find((d) => d.date === date);
      dataPoint[s.name] = point ? point.value : null;
    });

    return dataPoint;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-900">
              {formatValue(entry.value as number)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const commonProps = {
    data: chartData,
    margin: { top: 10, right: 30, left: 60, bottom: 30 },
  };

  const renderChart = () => {
    switch (type) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis
              dataKey="date"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              label={xAxisLabel ? { value: xAxisLabel, position: "bottom" } : undefined}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend wrapperStyle={{ fontSize: "14px" }} />}
            {series.map((s, idx) => (
              <Area
                key={s.id}
                type="monotone"
                dataKey={s.name}
                stroke={s.color || `hsl(${idx * 60}, 70%, 50%)`}
                fill={s.color || `hsl(${idx * 60}, 70%, 50%)`}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis
              dataKey="date"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              label={xAxisLabel ? { value: xAxisLabel, position: "bottom" } : undefined}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend wrapperStyle={{ fontSize: "14px" }} />}
            {series.map((s, idx) => (
              <Bar
                key={s.id}
                dataKey={s.name}
                fill={s.color || `hsl(${idx * 60}, 70%, 50%)`}
              />
            ))}
          </BarChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis
              dataKey="date"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              label={xAxisLabel ? { value: xAxisLabel, position: "bottom" } : undefined}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend wrapperStyle={{ fontSize: "14px" }} />}
            {series.map((s, idx) => (
              <Line
                key={s.id}
                type="monotone"
                dataKey={s.name}
                stroke={s.color || `hsl(${idx * 60}, 70%, 50%)`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}