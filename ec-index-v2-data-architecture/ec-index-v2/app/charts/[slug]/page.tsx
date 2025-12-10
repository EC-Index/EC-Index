// app/charts/[slug]/page.tsx
/**
 * Chart Detail Page
 * 
 * Displays a single chart with full details.
 * Uses chart-service for data access.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { getChartBySlug, getAllCharts } from "../../../lib/charts";
import {
  getChartSeries,
  getChartMetadata,
  isOfficialBenchmark,
  hasRealData,
} from "../../../lib/services/chart-service";
import Section from "../../../components/common/Section";
import ChartDetail from "../../../components/charts/ChartDetail";
import Tag from "../../../components/common/Tag";
import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import { ArrowLeft, Info, CheckCircle, AlertCircle } from "lucide-react";

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

  // Get data via chart-service
  const series = getChartSeries(slug);
  const metadata = getChartMetadata(slug);
  const isBenchmark = isOfficialBenchmark(slug);
  const isRealData = hasRealData(slug);

  // Extract benchmark code from title if present
  const benchmarkCodeMatch = chart.title.match(/\(([^)]+)\)/);
  const benchmarkCode = benchmarkCodeMatch ? benchmarkCodeMatch[1] : null;

  // Prepare serializable data for client component
  const chartData = {
    title: chart.title,
    chartType: chart.chartType,
    yAxisLabel: chart.yAxisLabel,
    xAxisLabel: chart.xAxisLabel,
  };

  return (
    <div className="bg-white">
      {/* Header Section */}
      <Section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="mb-4">
          <Link
            href="/charts"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Charts
          </Link>
        </div>

        <div className="max-w-4xl">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {isBenchmark && (
              <Badge variant="featured">Official Benchmark</Badge>
            )}
            {benchmarkCode && (
              <Badge variant="default">{benchmarkCode}</Badge>
            )}
            {chart.platforms.map((platform) => (
              <Tag key={platform} variant="platform">
                {platform}
              </Tag>
            ))}
            <Tag variant="category">{chart.category}</Tag>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {chart.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-4">
            {chart.longDescription || chart.shortDescription}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Last Updated:</span>{" "}
              {formatDate(metadata.lastUpdated)}
            </div>
            <div>
              <span className="font-medium">Data Source:</span>{" "}
              {metadata.dataSource}
            </div>
            {metadata.sampleSize && (
              <div>
                <span className="font-medium">Sample Size:</span>{" "}
                {metadata.sampleSize}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Data Status Banner */}
      <Section className={`py-4 border-b ${isRealData ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
        <div className="flex items-start gap-3">
          {isRealData ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <strong>Live Data:</strong> This chart displays real market data
                from {metadata.dataSource}.
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Demo Data:</strong> This chart currently displays
                representative sample data for demonstration purposes. The
                methodology matches our planned real data calculation.
              </div>
            </>
          )}
        </div>
      </Section>

      {/* Chart */}
      <Section className="py-12">
        <ChartDetail chart={chartData} series={series} />
      </Section>

      {/* Methodology Section */}
      <Section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Chart Methodology
          </h2>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Calculation Method
            </h3>
            <p className="text-gray-700 mb-4">
              {metadata.methodology || chart.longDescription}
            </p>

            {isBenchmark && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Official EC-Index Benchmark
                </h4>
                <p className="text-sm text-blue-800">
                  This index is one of the official EC-Index benchmarks. These
                  benchmarks are maintained with special care and have the
                  highest data quality and consistency standards.
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Data Sources
              </h3>
              <p className="text-gray-700">{metadata.dataSource}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Sample Size
              </h3>
              <p className="text-gray-700">
                {metadata.sampleSize || "Varies by time period"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/methodology">
                Learn More About Our Data Sources →
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

/**
 * Generate static params for all chart slugs
 */
export async function generateStaticParams() {
  const charts = getAllCharts();
  return charts.map((chart) => ({ slug: chart.slug }));
}
