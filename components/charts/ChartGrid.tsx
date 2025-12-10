"use client";

// components/charts/ChartGrid.tsx

import { ChartDefinition } from "@/lib/types";
import ChartCard from "./ChartCard";

interface ChartGridProps {
  charts: ChartDefinition[];
}

export default function ChartGrid({ charts }: ChartGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {charts.map((chart) => (
        <ChartCard key={chart.id} chart={chart} />
      ))}
    </div>
  );
}
