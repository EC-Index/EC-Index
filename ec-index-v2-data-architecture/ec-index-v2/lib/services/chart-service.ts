// lib/services/chart-service.ts
/**
 * EC-Index Chart Service
 * 
 * Centralized data access layer for all charts.
 * Handles loading from JSON files or falling back to mock data.
 */

import { ChartSeries, ChartDefinition, ChartJsonData, BENCHMARK_TO_JSON } from "../types";
import { getChartBySlug, getChartById, CHART_DEFINITIONS } from "../charts";

// ============================================================================
// JSON DATA IMPORTS
// ============================================================================

import smp300Data from "../data/smp-300.json";
import supVitData from "../data/sup-vit.json";
import snkMenData from "../data/snk-men.json";

/**
 * Registry of available JSON data files
 */
const JSON_DATA_REGISTRY: Record<string, ChartJsonData> = {
  "smp-300": smp300Data as ChartJsonData,
  "sup-vit": supVitData as ChartJsonData,
  "snk-men": snkMenData as ChartJsonData,
};

// ============================================================================
// CORE DATA LOADING FUNCTIONS
// ============================================================================

/**
 * Load series data from a JSON file by benchmark code.
 * 
 * @param benchmarkCode - The official benchmark code (e.g., "ECI-SMP-300")
 * @returns ChartSeries[] if JSON exists, null otherwise
 */
export function loadSeriesFromJSON(benchmarkCode: string): ChartSeries[] | null {
  const jsonKey = BENCHMARK_TO_JSON[benchmarkCode];
  
  if (!jsonKey) {
    console.warn(`[ChartService] No JSON mapping for benchmark: ${benchmarkCode}`);
    return null;
  }

  const jsonData = JSON_DATA_REGISTRY[jsonKey];
  
  if (!jsonData) {
    console.warn(`[ChartService] JSON data not found for: ${jsonKey}`);
    return null;
  }

  return jsonData.series;
}

/**
 * Load metadata from a JSON file by benchmark code.
 * 
 * @param benchmarkCode - The official benchmark code
 * @returns Metadata object if JSON exists, null otherwise
 */
export function loadMetadataFromJSON(benchmarkCode: string): ChartJsonData["metadata"] | null {
  const jsonKey = BENCHMARK_TO_JSON[benchmarkCode];
  
  if (!jsonKey) {
    return null;
  }

  const jsonData = JSON_DATA_REGISTRY[jsonKey];
  
  if (!jsonData) {
    return null;
  }

  return jsonData.metadata;
}

// ============================================================================
// MAIN DATA ACCESS FUNCTION
// ============================================================================

/**
 * Get chart series data for a given chart.
 * 
 * This is the main function that components should use.
 * It automatically:
 * 1. Looks up the chart by slug or ID
 * 2. Checks if JSON data is available (for dataSource: "json")
 * 3. Falls back to mock data if necessary
 * 
 * @param chartId - Chart slug or ID
 * @returns ChartSeries[] - Array of data series
 */
export function getChartSeries(chartId: string): ChartSeries[] {
  // Try to find by slug first, then by ID
  let chart = getChartBySlug(chartId);
  if (!chart) {
    chart = getChartById(chartId);
  }
  
  if (!chart) {
    console.warn(`[ChartService] Chart not found: ${chartId}`);
    return [];
  }

  // If chart has JSON data source and a benchmark code, try to load from JSON
  if (chart.dataSource === "json" && chart.benchmarkCode) {
    const jsonSeries = loadSeriesFromJSON(chart.benchmarkCode);
    
    if (jsonSeries && jsonSeries.length > 0) {
      return jsonSeries;
    }
    
    // JSON loading failed, fall back to mock
    console.info(`[ChartService] JSON unavailable for ${chart.benchmarkCode}, using mock data`);
  }

  // Return mock data
  return chart.getMockSeries();
}

/**
 * Get chart with its series data combined.
 * Useful for server components that need both together.
 * 
 * @param chartId - Chart slug or ID
 * @returns Object with chart and series, or null
 */
export function getChartWithSeries(chartId: string): {
  chart: ChartDefinition;
  series: ChartSeries[];
} | null {
  let chart = getChartBySlug(chartId);
  if (!chart) {
    chart = getChartById(chartId);
  }
  
  if (!chart) {
    return null;
  }

  return {
    chart,
    series: getChartSeries(chartId),
  };
}

/**
 * Get effective metadata for a chart.
 * Prefers JSON metadata if available, otherwise uses chart definition metadata.
 * 
 * @param chartId - Chart slug or ID
 * @returns Metadata object
 */
export function getChartMetadata(chartId: string): {
  lastUpdated: string;
  dataSource: string;
  sampleSize?: string;
  methodology?: string;
  isRealData: boolean;
} {
  let chart = getChartBySlug(chartId);
  if (!chart) {
    chart = getChartById(chartId);
  }
  
  if (!chart) {
    return {
      lastUpdated: new Date().toISOString(),
      dataSource: "Unknown",
      isRealData: false,
    };
  }

  // Try to get JSON metadata
  if (chart.benchmarkCode) {
    const jsonMetadata = loadMetadataFromJSON(chart.benchmarkCode);
    
    if (jsonMetadata) {
      return {
        lastUpdated: jsonMetadata.lastUpdated,
        dataSource: jsonMetadata.source,
        sampleSize: jsonMetadata.sampleSize,
        methodology: jsonMetadata.methodology,
        isRealData: true,
      };
    }
  }

  // Fall back to chart definition metadata
  return {
    lastUpdated: chart.metadata.lastUpdated,
    dataSource: chart.metadata.dataSource,
    sampleSize: chart.metadata.sampleSize,
    methodology: chart.metadata.methodology,
    isRealData: false,
  };
}

// ============================================================================
// BENCHMARK UTILITIES
// ============================================================================

/**
 * Get list of official benchmark slugs.
 */
export function getOfficialBenchmarks(): string[] {
  return CHART_DEFINITIONS
    .filter((chart) => chart.benchmarkCode !== null)
    .map((chart) => chart.slug);
}

/**
 * Check if a chart is an official benchmark.
 * 
 * @param chartId - Chart slug or ID
 * @returns boolean
 */
export function isOfficialBenchmark(chartId: string): boolean {
  let chart = getChartBySlug(chartId);
  if (!chart) {
    chart = getChartById(chartId);
  }
  
  return chart?.benchmarkCode !== null && chart?.benchmarkCode !== undefined;
}

/**
 * Check if a chart has real (non-mock) data available.
 * 
 * @param chartId - Chart slug or ID
 * @returns boolean
 */
export function hasRealData(chartId: string): boolean {
  let chart = getChartBySlug(chartId);
  if (!chart) {
    chart = getChartById(chartId);
  }
  
  if (!chart || !chart.benchmarkCode) {
    return false;
  }

  const jsonSeries = loadSeriesFromJSON(chart.benchmarkCode);
  return jsonSeries !== null && jsonSeries.length > 0;
}

// ============================================================================
// BULK DATA ACCESS
// ============================================================================

/**
 * Get all charts with their series data.
 * Warning: Can be slow with many charts.
 */
export function getAllChartsWithSeries(): Array<{
  chart: ChartDefinition;
  series: ChartSeries[];
}> {
  return CHART_DEFINITIONS.map((chart) => ({
    chart,
    series: getChartSeries(chart.slug),
  }));
}

/**
 * Get only featured charts with their series.
 */
export function getFeaturedChartsWithSeries(): Array<{
  chart: ChartDefinition;
  series: ChartSeries[];
}> {
  return CHART_DEFINITIONS
    .filter((chart) => chart.featured)
    .map((chart) => ({
      chart,
      series: getChartSeries(chart.slug),
    }));
}
