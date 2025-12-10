// lib/services/chart-service.ts
/**
 * EC-Index Chart Service
 * 
 * Dieser Service abstrahiert den Datenzugriff für Charts.
 * Aktuell werden Mock-Daten verwendet, aber die Struktur ermöglicht
 * eine einfache Umstellung auf echte API-Daten oder JSON-Imports.
 * 
 * HINWEIS: Die Methodik der Berechnungen entspricht bereits der
 * geplanten realen Datenverarbeitung. Nur die Datenquelle ist mock.
 */

import { ChartSeries, ChartDefinition } from "../types";
import { getChartBySlug, CHART_DEFINITIONS } from "../charts";

// ============================================================================
// JSON-Daten Imports (für spätere Verwendung vorbereitet)
// ============================================================================
// import eciSmp300Data from "../data/eci-smp-300.json";
// import eciSupVitData from "../data/eci-sup-vit.json";
// import eciSnkMenData from "../data/eci-snk-men.json";

/**
 * Mapping von Slugs zu JSON-Dateinamen
 * Wird verwendet, wenn wir auf echte JSON-Daten umstellen
 */
const CHART_DATA_SOURCES: Record<string, string> = {
  "electronics-pricing-trend": "eci-smp-300",
  "supplement-prices-ebay": "eci-sup-vit",
  "sneaker-listings-volume": "eci-snk-men",
};

/**
 * Holt die Datenserien für einen Chart.
 * 
 * Aktuell wird getMockSeries() verwendet.
 * Für die Umstellung auf echte Daten:
 * 1. JSON-Imports aktivieren (oben)
 * 2. transformJsonToSeries() Funktion nutzen
 * 3. Switch-Case oder Lookup für den jeweiligen Chart
 * 
 * @param slug - Der URL-Slug des Charts
 * @returns ChartSeries[] - Array von Datenserien für den Chart
 */
export function getChartSeries(slug: string): ChartSeries[] {
  const chart = getChartBySlug(slug);
  
  if (!chart) {
    console.warn(`[ChartService] Chart nicht gefunden: ${slug}`);
    return [];
  }

  // ============================================================================
  // MOCK-DATEN (aktuelle Implementierung)
  // Die getMockSeries()-Funktion generiert realistische Testdaten
  // mit korrekter Methodik entsprechend der Chart-Definition
  // ============================================================================
  return chart.getMockSeries();

  // ============================================================================
  // ECHTE DATEN (für spätere Implementierung)
  // Auskommentiert, aber vorbereitet für den Wechsel
  // ============================================================================
  /*
  const dataSource = CHART_DATA_SOURCES[slug];
  
  if (dataSource) {
    // Für die drei offiziellen Benchmarks: JSON-Daten laden
    return loadChartDataFromJson(slug, chart);
  } else {
    // Fallback auf Mock-Daten für andere Charts
    return chart.getMockSeries();
  }
  */
}

/**
 * Holt einen Chart mit seinen Serien kombiniert.
 * Nützlich für Server Components, die Chart und Daten zusammen brauchen.
 * 
 * @param slug - Der URL-Slug des Charts
 * @returns { chart: ChartDefinition, series: ChartSeries[] } | null
 */
export function getChartWithSeries(slug: string): { 
  chart: ChartDefinition; 
  series: ChartSeries[] 
} | null {
  const chart = getChartBySlug(slug);
  
  if (!chart) {
    return null;
  }

  return {
    chart,
    series: getChartSeries(slug),
  };
}

/**
 * Holt alle Charts mit ihren Serien.
 * Achtung: Kann bei vielen Charts langsam sein.
 * 
 * @returns Array von Charts mit ihren Serien
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
 * Prüft, ob ein Chart echte Daten hat (nicht nur Mock).
 * 
 * @param slug - Der URL-Slug des Charts
 * @returns boolean - true wenn echte Daten verfügbar
 */
export function hasRealData(slug: string): boolean {
  // Aktuell: Alle Charts nutzen Mock-Daten
  // TODO: Auf true setzen, wenn JSON-Daten aktiviert werden
  return false;
}

/**
 * Gibt die offiziellen Benchmark-Codes zurück.
 * Diese Charts haben priorisierte Datenqualität.
 */
export function getOfficialBenchmarks(): string[] {
  return [
    "electronics-pricing-trend",  // ECI-SMP-300
    "supplement-prices-ebay",     // ECI-SUP-VIT
    "sneaker-listings-volume",    // ECI-SNK-MEN
  ];
}

/**
 * Prüft, ob ein Chart ein offizieller Benchmark ist.
 * 
 * @param slug - Der URL-Slug des Charts
 * @returns boolean
 */
export function isOfficialBenchmark(slug: string): boolean {
  return getOfficialBenchmarks().includes(slug);
}

// ============================================================================
// HILFSFUNKTIONEN FÜR SPÄTERE JSON-INTEGRATION
// ============================================================================

/**
 * Transformiert JSON-Rohdaten in das ChartSeries-Format.
 * Vorbereitet für die spätere Aktivierung.
 * 
 * @param jsonData - Rohdaten aus JSON
 * @param chart - Chart-Definition für Metadaten
 * @returns ChartSeries[]
 */
/*
function transformJsonToSeries(
  jsonData: Array<{ date: string; platform?: string; value: number }>,
  chart: ChartDefinition
): ChartSeries[] {
  // Gruppiere nach Plattform, falls vorhanden
  const platformGroups = new Map<string, Array<{ date: string; value: number }>>();
  
  jsonData.forEach((point) => {
    const platform = point.platform || "default";
    if (!platformGroups.has(platform)) {
      platformGroups.set(platform, []);
    }
    platformGroups.get(platform)!.push({ date: point.date, value: point.value });
  });

  // Konvertiere zu ChartSeries
  const series: ChartSeries[] = [];
  const platformColors: Record<string, string> = {
    amazon: "#FF9900",
    ebay: "#E53238",
    idealo: "#0066CC",
    other: "#6B7280",
    default: "#3B82F6",
  };

  platformGroups.forEach((data, platform) => {
    series.push({
      name: platform === "default" ? chart.title : platform.charAt(0).toUpperCase() + platform.slice(1),
      data: data.map((d) => ({ date: d.date, value: d.value })),
      color: platformColors[platform] || "#3B82F6",
    });
  });

  return series;
}
*/
