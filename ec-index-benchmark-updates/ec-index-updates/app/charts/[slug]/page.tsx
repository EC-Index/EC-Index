// app/charts/[slug]/page.tsx
/**
 * Chart Detail Page
 * 
 * Zeigt einen einzelnen Chart mit allen Details an.
 * Nutzt den ChartService für den Datenzugriff.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { getChartBySlug } from "@/lib/charts";
import { getChartSeries, isOfficialBenchmark } from "@/lib/services/chart-service";
import Section from "@/components/common/Section";
import ChartDetail from "@/components/charts/ChartDetail";
import Tag from "@/components/common/Tag";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import { ArrowLeft, Info } from "lucide-react";

// Hilfsfunktion für Datumsformatierung (ohne date-fns)
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface ChartDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChartDetailPage({ params }: ChartDetailPageProps) {
  const { slug } = await params;
  const chart = getChartBySlug(slug);

  if (!chart) {
    notFound();
  }

  // Hole Chart-Daten über den Service (nicht direkt getMockSeries)
  const series = getChartSeries(slug);
  const isBenchmark = isOfficialBenchmark(slug);

  // Extrahiere Benchmark-Code aus dem Titel, falls vorhanden
  const benchmarkCodeMatch = chart.title.match(/\(([^)]+)\)/);
  const benchmarkCode = benchmarkCodeMatch ? benchmarkCodeMatch[1] : null;

  return (
    <div className="bg-white">
      {/* Header */}
      <Section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="mb-4">
          <Link
            href="/charts"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Zurück zu Charts
          </Link>
        </div>

        <div className="max-w-4xl">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {isBenchmark && (
              <Badge variant="featured">
                Offizieller Benchmark
              </Badge>
            )}
            {benchmarkCode && (
              <Badge variant="default">
                {benchmarkCode}
              </Badge>
            )}
            {chart.platforms.map((platform) => (
              <Tag key={platform} variant="platform">
                {platform}
              </Tag>
            ))}
            <Tag variant="category">{chart.category}</Tag>
          </div>

          {/* Titel */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {chart.title}
          </h1>

          {/* Beschreibung */}
          <p className="text-lg text-gray-600 mb-4">
            {chart.longDescription || chart.shortDescription}
          </p>

          {/* Metadaten */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Letztes Update:</span>{" "}
              {formatDate(chart.metadata.lastUpdated)}
            </div>
            <div>
              <span className="font-medium">Datenquelle:</span>{" "}
              {chart.metadata.dataSource}
            </div>
            {chart.metadata.sampleSize && (
              <div>
                <span className="font-medium">Stichprobe:</span>{" "}
                {chart.metadata.sampleSize}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Mock-Daten Hinweis */}
      <Section className="py-4 bg-amber-50 border-b border-amber-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Hinweis:</strong> Dieser Chart zeigt aktuell Mock-Daten zu Demonstrationszwecken. 
            Die Methodik entspricht bereits der geplanten realen Berechnung. 
            Echte Datenintegration erfolgt in einer zukünftigen Version.
          </div>
        </div>
      </Section>

      {/* Chart */}
      <Section className="py-12">
        <ChartDetail chart={chart} series={series} />
      </Section>

      {/* Methodik */}
      <Section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Chart-Methodik
          </h2>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Berechnungsmethode
            </h3>
            <p className="text-gray-700 mb-4">
              {chart.metadata.methodology}
            </p>
            
            {isBenchmark && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Offizieller EC-Index Benchmark
                </h4>
                <p className="text-sm text-blue-800">
                  Dieser Index gehört zu den drei offiziellen EC-Index Benchmarks. 
                  Diese Benchmarks werden mit besonderer Sorgfalt gepflegt und 
                  haben die höchste Datenqualität und -konsistenz.
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Datenquellen
              </h3>
              <p className="text-gray-700">
                {chart.metadata.dataSource}
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Stichprobengröße
              </h3>
              <p className="text-gray-700">
                {chart.metadata.sampleSize || "Variiert je nach Zeitraum"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/methodology">
                Mehr über unsere Datenquellen erfahren →
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

/**
 * Generiere statische Params für alle Chart-Slugs (für Static Export)
 */
export async function generateStaticParams() {
  const { getAllCharts } = await import("@/lib/charts");
  const charts = getAllCharts();

  return charts.map((chart) => ({
    slug: chart.slug,
  }));
}
