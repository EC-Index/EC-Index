// lib/charts.ts
/**
 * EC-Index Chart Definitionen
 * 
 * Diese Datei enthält alle Chart-Definitionen für den EC-Index.
 * Die ersten drei Charts sind die offiziellen EC-Index Benchmarks:
 * - ECI-SMP-300: Budget Smartphone Price Index
 * - ECI-SUP-VIT: Supplement Price Index
 * - ECI-SNK-MEN: Sneaker Supply Index
 * 
 * HINWEIS: Die Daten sind aktuell MOCK-Daten zu Demonstrationszwecken.
 * Die Methodik entspricht jedoch bereits der geplanten realen Berechnung.
 */

import {
  ChartDefinition,
  ChartSeries,
  DataPoint,
  ChartFilter,
  Platform,
} from "./types";

// ============================================================================
// MOCK-DATEN GENERATOR
// ============================================================================

/**
 * Generiert Mock-Zeitreihen-Daten.
 * Die Generierung folgt realistischen Mustern für E-Commerce-Daten.
 */
function generateMockTimeSeries(
  months: number,
  baseValue: number,
  trend: "up" | "down" | "stable" | "volatile" = "stable",
  intervalDays: number = 7
): DataPoint[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const dates: Date[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + intervalDays);
  }

  const dataPoints: DataPoint[] = [];
  let currentValue = baseValue;
  const trendMultiplier = trend === "up" ? 1.002 : trend === "down" ? 0.998 : 1;

  dates.forEach((date) => {
    const noise = (Math.random() - 0.5) * 2 * (currentValue * (trend === "volatile" ? 0.1 : 0.03));
    currentValue = currentValue * trendMultiplier + noise;
    currentValue = Math.max(0, currentValue);

    dataPoints.push({
      date: date.toISOString().split("T")[0],
      value: currentValue,
    });
  });

  return dataPoints;
}

// ============================================================================
// OFFIZIELLE EC-INDEX BENCHMARKS
// ============================================================================

/**
 * ECI-SMP-300: Budget Smartphone Price Index
 * 
 * Methodik (entspricht realer Berechnung):
 * - Wöchentliche Erfassung aller Smartphone-Angebote unter €300
 * - Gewichteter Durchschnitt nach Verkaufsrang
 * - Plattformen: Amazon DE, eBay DE, Idealo
 * - Ausschluss: Refurbished, B-Ware, Ausstellungsstücke
 */
const ECI_SMP_300: ChartDefinition = {
  id: "electronics-pricing-trend",
  slug: "electronics-pricing-trend",
  title: "Budget Smartphone Price Index (ECI-SMP-300)",
  shortDescription:
    "Durchschnittspreis für Smartphones unter €300 auf den wichtigsten deutschen Marktplätzen",
  longDescription:
    "Der ECI-SMP-300 misst die wöchentliche Preisentwicklung für Budget-Smartphones (Neugeräte unter €300) auf Amazon, eBay und Idealo. Der Index zeigt langfristige Preistrends und saisonale Muster im deutschen Smartphone-Markt. Ausgeschlossen sind refurbished Geräte, B-Ware und Ausstellungsstücke.",
  category: "prices",
  platforms: ["amazon", "ebay", "idealo"],
  previewMetric: "Ø Preis (EUR)",
  yAxisLabel: "Durchschnittspreis (EUR)",
  xAxisLabel: "Datum",
  chartType: "line",
  featured: true,
  metadata: {
    lastUpdated: new Date().toISOString(),
    // HINWEIS: Aktuell Mock-Daten, Methodik entspricht realer Berechnung
    dataSource: "Öffentliche Marktplatzdaten (Amazon DE, eBay DE, Idealo)",
    sampleSize: "~5.000 Produkte pro Woche",
    methodology:
      "Wöchentlicher gewichteter Durchschnitt der Angebotspreise für Neugeräte-Smartphones unter €300. Gewichtung nach Verkaufsrang. Ausschluss von Refurbished und B-Ware.",
  },
  getMockSeries: () => [
    {
      name: "Amazon",
      data: generateMockTimeSeries(24, 245, "down"),
      color: "#FF9900",
    },
    {
      name: "eBay",
      data: generateMockTimeSeries(24, 235, "stable"),
      color: "#E53238",
    },
    {
      name: "Idealo",
      data: generateMockTimeSeries(24, 240, "down"),
      color: "#0066CC",
    },
  ],
};

/**
 * ECI-SUP-VIT: Supplement Price Index
 * 
 * Methodik (entspricht realer Berechnung):
 * - Wöchentliche Erfassung von Vitamin- und Supplement-Angeboten
 * - Fokus auf Top-20 Kategorien (Vitamin D, Omega-3, Magnesium, etc.)
 * - Nur gewerbliche Verkäufer mit >100 Bewertungen
 * - Normalisierung auf Standarddosierung
 */
const ECI_SUP_VIT: ChartDefinition = {
  id: "supplement-prices-ebay",
  slug: "supplement-prices-ebay",
  title: "Supplement Price Index (ECI-SUP-VIT)",
  shortDescription:
    "Durchschnittspreis für Nahrungsergänzungsmittel auf eBay Deutschland",
  longDescription:
    "Der ECI-SUP-VIT erfasst die Preisentwicklung von Nahrungsergänzungsmitteln und Vitaminen auf eBay Deutschland. Der Index fokussiert auf die Top-20 Supplement-Kategorien und zeigt saisonale Nachfrageschwankungen sowie Preistrends. Alle Preise sind auf Standarddosierungen normalisiert.",
  category: "prices",
  platforms: ["ebay"],
  previewMetric: "Ø Preis (EUR)",
  yAxisLabel: "Durchschnittspreis (EUR)",
  xAxisLabel: "Datum",
  chartType: "area",
  featured: true,
  metadata: {
    lastUpdated: new Date().toISOString(),
    // HINWEIS: Aktuell Mock-Daten, Methodik entspricht realer Berechnung
    dataSource: "eBay Deutschland öffentliche Angebote",
    sampleSize: "~2.500 Produkte pro Woche",
    methodology:
      "Wöchentlicher Durchschnitt normalisierter Preise für Top-20 Supplement-Kategorien. Nur gewerbliche Verkäufer mit >100 Bewertungen. Preise normalisiert auf Standarddosierung pro Einheit.",
  },
  getMockSeries: () => [
    {
      name: "Supplement-Index",
      data: generateMockTimeSeries(24, 28.5, "up"),
      color: "#10B981",
    },
  ],
};

/**
 * ECI-SNK-MEN: Sneaker Supply Index
 * 
 * Methodik (entspricht realer Berechnung):
 * - Wöchentliche Zählung aktiver Angebote
 * - Kategorie: Herren-Sneaker (alle Größen)
 * - Plattformen: Amazon DE, eBay DE, weitere Marktplätze
 * - Ausschluss: Auktionen, Duplikate, offensichtliche Fälschungen
 */
const ECI_SNK_MEN: ChartDefinition = {
  id: "sneaker-listings-volume",
  slug: "sneaker-listings-volume",
  title: "Sneaker Supply Index (ECI-SNK-MEN)",
  shortDescription:
    "Anzahl aktiver Herren-Sneaker-Angebote auf den wichtigsten Marktplätzen",
  longDescription:
    "Der ECI-SNK-MEN misst das wöchentliche Angebot an Herren-Sneakern über mehrere Plattformen. Der Index zeigt Marktdynamik, Händleraktivität und saisonale Schwankungen im deutschen Sneaker-Markt. Ausgewertet werden nur Festpreisangebote, keine Auktionen.",
  category: "supply",
  platforms: ["amazon", "ebay", "other"],
  previewMetric: "Aktive Angebote",
  yAxisLabel: "Anzahl Angebote",
  xAxisLabel: "Datum",
  chartType: "line",
  featured: true,
  metadata: {
    lastUpdated: new Date().toISOString(),
    // HINWEIS: Aktuell Mock-Daten, Methodik entspricht realer Berechnung
    dataSource: "Multi-Plattform öffentliche Daten",
    sampleSize: "~50.000 Angebote pro Woche",
    methodology:
      "Wöchentliche Zählung aktiver Festpreis-Angebote in der Kategorie Herren-Sneaker. Duplikaterkennung und Ausschluss offensichtlicher Fälschungen. Kategorien: Amazon DE, eBay DE, weitere Marktplätze.",
  },
  getMockSeries: () => [
    {
      name: "Amazon",
      data: generateMockTimeSeries(24, 15200, "up"),
      color: "#FF9900",
    },
    {
      name: "eBay",
      data: generateMockTimeSeries(24, 22400, "stable"),
      color: "#E53238",
    },
    {
      name: "Andere",
      data: generateMockTimeSeries(24, 8500, "up"),
      color: "#6B7280",
    },
  ],
};

// ============================================================================
// WEITERE CHART-DEFINITIONEN
// ============================================================================

const ELECTRONICS_VOLATILITY: ChartDefinition = {
  id: "electronics-price-volatility",
  slug: "electronics-price-volatility",
  title: "Electronics Price Volatility Index",
  shortDescription:
    "Preisvolatilität in wichtigen Elektronik-Kategorien",
  longDescription:
    "Misst die Preisschwankungen (Standardabweichung) für große Elektronik-Kategorien. Höhere Werte bedeuten volatilere Preise.",
  category: "volatility",
  platforms: ["amazon", "ebay", "idealo"],
  previewMetric: "Volatilitäts-Index",
  yAxisLabel: "Volatilität (%)",
  xAxisLabel: "Datum",
  chartType: "line",
  featured: true,
  metadata: {
    lastUpdated: new Date().toISOString(),
    dataSource: "Multi-Plattform Preisdaten",
    sampleSize: "~20.000 Produkte",
    methodology:
      "Rollende 30-Tage-Standardabweichung täglicher Preisänderungen",
  },
  getMockSeries: () => [
    {
      name: "Volatilität",
      data: generateMockTimeSeries(24, 12.5, "volatile"),
      color: "#EF4444",
    },
  ],
};

const PLATFORM_COMPARISON: ChartDefinition = {
  id: "platform-price-comparison",
  slug: "platform-price-comparison",
  title: "Cross-Platform Price Comparison",
  shortDescription:
    "Preisvergleich gleicher Produktkategorien über Plattformen hinweg",
  longDescription:
    "Vergleicht Durchschnittspreise für äquivalente Produktkategorien auf Amazon, eBay, Temu und Shein. Zeigt, welche Plattform typischerweise günstiger ist.",
  category: "prices",
  platforms: ["amazon", "ebay", "temu", "shein"],
  previewMetric: "Preis-Index",
  yAxisLabel: "Preis-Index (100 = Baseline)",
  xAxisLabel: "Datum",
  chartType: "line",
  featured: true,
  metadata: {
    lastUpdated: new Date().toISOString(),
    dataSource: "Öffentliche Marktplatzdaten",
    sampleSize: "~10.000 vergleichbare Produkte",
    methodology:
      "Normalisierter Preisindex für äquivalente Produktkategorien",
  },
  getMockSeries: () => [
    {
      name: "Amazon",
      data: generateMockTimeSeries(24, 100, "stable"),
      color: "#FF9900",
    },
    {
      name: "eBay",
      data: generateMockTimeSeries(24, 95, "stable"),
      color: "#E53238",
    },
    {
      name: "Temu",
      data: generateMockTimeSeries(24, 72, "up"),
      color: "#F97316",
    },
    {
      name: "Shein",
      data: generateMockTimeSeries(24, 68, "stable"),
      color: "#EC4899",
    },
  ],
};

const FASHION_DISCOUNTS: ChartDefinition = {
  id: "discount-heatmap-fashion",
  slug: "discount-heatmap-fashion",
  title: "Fashion Discount Trends",
  shortDescription:
    "Durchschnittliche Rabatte in der Fashion-Kategorie nach Plattform",
  longDescription:
    "Verfolgt durchschnittliche Rabattniveaus (% vom Originalpreis) für Fashion-Artikel auf großen Marktplätzen. Zeigt Promotion-Strategien.",
  category: "discounts",
  platforms: ["amazon", "ebay", "shein"],
  previewMetric: "Ø Rabatt %",
  yAxisLabel: "Rabatt (%)",
  xAxisLabel: "Datum",
  chartType: "bar",
  featured: true,
  metadata: {
    lastUpdated: new Date().toISOString(),
    dataSource: "Öffentliche Angebotsdaten mit Originalpreisen",
    sampleSize: "~15.000 Fashion-Artikel",
    methodology: "Wöchentlicher Durchschnitt der beworbenen Rabatte",
  },
  getMockSeries: () => [
    {
      name: "Amazon Fashion",
      data: generateMockTimeSeries(12, 22, "volatile", 30),
      color: "#FF9900",
    },
    {
      name: "eBay Fashion",
      data: generateMockTimeSeries(12, 18, "stable", 30),
      color: "#E53238",
    },
    {
      name: "Shein",
      data: generateMockTimeSeries(12, 35, "volatile", 30),
      color: "#EC4899",
    },
  ],
};

const NEW_LISTINGS_TECH: ChartDefinition = {
  id: "new-listings-tech",
  slug: "new-listings-tech",
  title: "New Tech Product Listings per Week",
  shortDescription:
    "Wöchentliches Volumen neuer Produkt-Listings in Technologie-Kategorien",
  longDescription:
    "Misst die Rate neuer Produkt-Listings in Technologie-Kategorien. Zeigt Marktaktivität und Verkäuferverhalten.",
  category: "listings",
  platforms: ["amazon", "ebay", "other"],
  previewMetric: "Neue Listings/Woche",
  yAxisLabel: "Anzahl neuer Listings",
  xAxisLabel: "Datum",
  chartType: "bar",
  featured: false,
  metadata: {
    lastUpdated: new Date().toISOString(),
    dataSource: "Multi-Plattform Listing-Daten",
    sampleSize: "Alle neuen Tech-Listings",
    methodology: "Wöchentliche Zählung neu erstellter Listings",
  },
  getMockSeries: () => [
    {
      name: "Neue Listings",
      data: generateMockTimeSeries(24, 3450, "stable"),
      color: "#3B82F6",
    },
  ],
};

const BESTSELLER_CONCENTRATION: ChartDefinition = {
  id: "bestseller-concentration",
  slug: "bestseller-concentration",
  title: "Bestseller Concentration Index",
  shortDescription:
    "Anteil der Top-10% Produkte am Gesamtumsatz",
  longDescription:
    "Misst die Marktkonzentration durch Tracking des Umsatzanteils der Top-10% Bestseller. Höhere Werte zeigen konzentriertere Märkte.",
  category: "concentration",
  platforms: ["amazon", "ebay"],
  previewMetric: "Konzentration %",
  yAxisLabel: "Top 10% Umsatzanteil (%)",
  xAxisLabel: "Datum",
  chartType: "area",
  featured: false,
  metadata: {
    lastUpdated: new Date().toISOString(),
    dataSource: "Öffentliche Verkaufsrang-Daten",
    sampleSize: "~30.000 Produkte",
    methodology:
      "Geschätzte Umsatzkonzentration basierend auf Bestseller-Rankings",
  },
  getMockSeries: () => [
    {
      name: "Konzentration",
      data: generateMockTimeSeries(24, 68, "up"),
      color: "#8B5CF6",
    },
  ],
};

// ============================================================================
// CHART DEFINITIONEN EXPORT
// ============================================================================

/**
 * Alle Chart-Definitionen.
 * Die ersten drei sind die offiziellen EC-Index Benchmarks.
 */
export const CHART_DEFINITIONS: ChartDefinition[] = [
  // Offizielle Benchmarks (featured)
  ECI_SMP_300,
  ECI_SUP_VIT,
  ECI_SNK_MEN,
  // Weitere Charts
  ELECTRONICS_VOLATILITY,
  PLATFORM_COMPARISON,
  FASHION_DISCOUNTS,
  NEW_LISTINGS_TECH,
  BESTSELLER_CONCENTRATION,
];

// ============================================================================
// HILFSFUNKTIONEN
// ============================================================================

/**
 * Alle Charts abrufen
 */
export function getAllCharts(): ChartDefinition[] {
  return CHART_DEFINITIONS;
}

/**
 * Featured Charts für Homepage abrufen
 */
export function getFeaturedCharts(): ChartDefinition[] {
  return CHART_DEFINITIONS.filter((chart) => chart.featured);
}

/**
 * Chart nach Slug abrufen
 */
export function getChartBySlug(slug: string): ChartDefinition | undefined {
  return CHART_DEFINITIONS.find((chart) => chart.slug === slug);
}

/**
 * Charts nach Filter abrufen
 */
export function getChartsByFilter(filter: ChartFilter): ChartDefinition[] {
  let filtered = CHART_DEFINITIONS;

  if (filter.platforms && filter.platforms.length > 0) {
    filtered = filtered.filter((chart) =>
      chart.platforms.some((p) => filter.platforms?.includes(p))
    );
  }

  if (filter.categories && filter.categories.length > 0) {
    filtered = filtered.filter((chart) =>
      filter.categories?.includes(chart.category)
    );
  }

  if (filter.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (chart) =>
        chart.title.toLowerCase().includes(query) ||
        chart.shortDescription.toLowerCase().includes(query)
    );
  }

  return filtered;
}

/**
 * Alle verwendeten Plattformen abrufen
 */
export function getAllPlatforms(): Platform[] {
  const platforms = new Set<Platform>();
  CHART_DEFINITIONS.forEach((chart) => {
    chart.platforms.forEach((p) => platforms.add(p));
  });
  return Array.from(platforms);
}

/**
 * Plattform-Anzeigename abrufen
 */
export function getPlatformDisplayName(platform: Platform): string {
  const names: Record<Platform, string> = {
    amazon: "Amazon",
    ebay: "eBay",
    temu: "Temu",
    shein: "Shein",
    idealo: "Idealo",
    geizhals: "Geizhals",
    check24: "Check24",
    other: "Andere",
  };
  return names[platform];
}

/**
 * Kategorie-Anzeigename abrufen
 */
export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    prices: "Preise",
    supply: "Angebot",
    demand: "Nachfrage",
    discounts: "Rabatte",
    "market-share": "Marktanteile",
    volatility: "Volatilität",
    listings: "Listings",
    concentration: "Konzentration",
  };
  return names[category] || category;
}
