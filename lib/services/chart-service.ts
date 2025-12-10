// lib/services/chart-service.ts

import { charts } from "../charts";
import { ChartDefinition } from "../types";

export function getAllCharts(): ChartDefinition[] {
  return charts;
}

export function getChartsByFilter({
  category,
  platform,
}: {
  category?: string;
  platform?: string;
}): ChartDefinition[] {
  return charts.filter((chart) => {
    let ok = true;
    if (category) ok = ok && chart.category === category;
    if (platform) ok = ok && chart.platforms?.includes(platform);
    return ok;
  });
}
