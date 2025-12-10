import { CHART_DEFINITIONS, getChartsByFilter as filterCharts } from "../charts";
import { ChartDefinition } from "../types";

export function getAllCharts(): ChartDefinition[] {
  return CHART_DEFINITIONS;
}

export function getChartsByFilter(filter: any): ChartDefinition[] {
  return filterCharts(filter);
}
