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

interface ChartDetailProps {
  chartData: {
    title: string;
    yAxisLabel: string;
    xAxisLabel: string;
    chartType: "line" | "area" | "bar";
  };
  series: ChartSeries[];
}

export default function ChartDetail({ chartData, series }: ChartDetailProps) {
  // Prepare data for the chart
  const allDates = series[0]?.data.map((d) => d.date) || [];
  const chartDataPoints = allDates.map((date) => {
    const dataPoint: any = {
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

  const renderChart = () => {
    const commonProps = {
      width: "100%",
      height: 400,
      data: chartDataPoints,
    };

    switch (chartData.chartType) {
      case "area":
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={chartDataPoints}>
              <defs>
                {series.map((s, idx) => (
                  <linearGradient
                    key={idx}
                    id={`gradient-detail-${idx}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={s.color || "#3B82F6"}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={s.color || "#3B82F6"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                label={{
                  value: chartData.yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />
              {series.map((s, idx) => (
                <Area
                  key={idx}
                  type="monotone"
                  dataKey={s.name}
                  stroke={s.color || "#3B82F6"}
                  fill={`url(#gradient-detail-${idx})`}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={chartDataPoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                label={{
                  value: chartData.yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />
              {series.map((s, idx) => (
                <Bar key={idx} dataKey={s.name} fill={s.color || "#3B82F6"} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      default: // line
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={chartDataPoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                label={{
                  value: chartData.yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />
              {series.map((s, idx) => (
                <Line
                  key={idx}
                  type="monotone"
                  dataKey={s.name}
                  stroke={s.color || "#3B82F6"}
                  strokeWidth={2}
                  dot={false}
                />
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