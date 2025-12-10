"use client";

import { ChartSeries } from "@/lib/types";
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

interface ChartData {
  title: string;
  chartType: "line" | "area" | "bar";
  yAxisLabel: string;
  xAxisLabel: string;
}

interface ChartDetailProps {
  chart: ChartData;
  series: ChartSeries[];
}

export default function ChartDetail({ chart, series }: ChartDetailProps) {
  const allDates = series[0]?.data.map((d) => d.date) || [];
  const chartData = allDates.map((date) => {
    const dataPoint: Record<string, string | number | null> = {
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    };
    series.forEach((s) => {
      const point = s.data.find((d) => d.date === date);
      dataPoint[s.name] = point ? point.value : null;
    });
    return dataPoint;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chart.chartType) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                {series.map((s, idx) => (
                  <linearGradient key={idx} id={"gradient-" + idx} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color || "#3B82F6"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={s.color || "#3B82F6"} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: chart.yAxisLabel, angle: -90, position: "insideLeft" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {series.map((s, idx) => (
                <Area key={idx} type="monotone" dataKey={s.name} stroke={s.color || "#3B82F6"} fill={`url(#gradient-${idx})`} strokeWidth={2} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: chart.yAxisLabel, angle: -90, position: "insideLeft" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {series.map((s, idx) => (
                <Bar key={idx} dataKey={s.name} fill={s.color || "#3B82F6"} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: chart.yAxisLabel, angle: -90, position: "insideLeft" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {series.map((s, idx) => (
                <Line key={idx} type="monotone" dataKey={s.name} stroke={s.color || "#3B82F6"} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {renderChart()}
    </div>
  );
}
