"use client";

// components/charts/ChartDetail.tsx
/**
 * ChartDetail Komponente
 * 
 * Zeigt einen Chart mit allen Serien in voller Größe an.
 * Akzeptiert series als Prop für Flexibilität bei der Datenquelle.
 */

import { ChartDefinition, ChartSeries } from "@/lib/types";
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
  chart: ChartDefinition;
  // Optional: Wenn nicht angegeben, wird getMockSeries() verwendet
  series?: ChartSeries[];
}

export default function ChartDetail({ chart, series }: ChartDetailProps) {
  // Nutze übergebene series oder fallback auf getMockSeries
  const chartSeries = series || chart.getMockSeries();

  // Bereite Daten für den Chart vor
  // Kombiniere alle Serien in einen einzelnen Dataset
  const allDates = chartSeries[0]?.data.map((d) => d.date) || [];
  const chartData = allDates.map((date) => {
    const dataPoint: Record<string, string | number | null> = {
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    };

    chartSeries.forEach((s) => {
      const point = s.data.find((d) => d.date === date);
      dataPoint[s.name] = point ? point.value : null;
    });

    return dataPoint;
  });

  // Custom Tooltip Komponente
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString('de-DE', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 2 
              }) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const chartDataPoints = chartData;

    switch (chart.chartType) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartDataPoints}>
              <defs>
                {chartSeries.map((s, idx) => (
                  <linearGradient
                    key={idx}
                    id={"gradient-detail-" + idx}
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
                  value: chart.yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {chartSeries.map((s, idx) => (
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
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartDataPoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                label={{
                  value: chart.yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {chartSeries.map((s, idx) => (
                <Bar key={idx} dataKey={s.name} fill={s.color || "#3B82F6"} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      default: // line
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartDataPoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                label={{
                  value: chart.yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {chartSeries.map((s, idx) => (
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
