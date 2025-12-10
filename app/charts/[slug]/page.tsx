// app/charts/[slug]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { getChartBySlug } from "@/lib/charts";
import Section from "@/components/common/Section";
import ChartDetail from "@/components/charts/ChartDetail";
import Tag from "@/components/common/Tag";
import Button from "@/components/common/Button";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ChartDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const chartDef = getChartBySlug(params.slug);

  if (!chartDef) {
    notFound();
  }

  // Load data HERE in server component
  const series = chartDef.getMockSeries();

  // Create clean object WITHOUT functions
  const chart = {
    id: chartDef.id,
    slug: chartDef.slug,
    title: chartDef.title,
    shortDescription: chartDef.shortDescription,
    longDescription: chartDef.longDescription,
    category: chartDef.category,
    platforms: chartDef.platforms,
    previewMetric: chartDef.previewMetric,
    yAxisLabel: chartDef.yAxisLabel,
    xAxisLabel: chartDef.xAxisLabel,
    chartType: chartDef.chartType,
    metadata: chartDef.metadata,
    featured: chartDef.featured,
  };

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
            Back to Charts
          </Link>
        </div>

        <div className="max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {chart.platforms.map((platform) => (
              <Tag key={platform} variant="platform">
                {platform}
              </Tag>
            ))}
            <Tag variant="category">{chart.category}</Tag>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {chart.title}
          </h1>

          <p className="text-lg text-gray-600 mb-4">
            {chart.longDescription || chart.shortDescription}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Last Updated:</span>{" "}
              {formatDate(chart.metadata.lastUpdated)}
            </div>
            <div>
              <span className="font-medium">Data Source:</span>{" "}
              {chart.metadata.dataSource}
            </div>
            {chart.metadata.sampleSize && (
              <div>
                <span className="font-medium">Sample Size:</span>{" "}
                {chart.metadata.sampleSize}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Chart */}
      <Section className="py-12">
        <ChartDetail chartData={chart} series={series} />
      </Section>

      {/* Methodology */}
      <Section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Chart Methodology
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-700 mb-4">
              {chart.metadata.methodology || chart.longDescription}
            </p>
            <p className="text-sm text-gray-500 italic">
              Note: This chart currently displays mock data for demonstration
              purposes. Real data integration is coming soon.
            </p>
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

// Generate static params for all chart slugs
export async function generateStaticParams() {
  const { getAllCharts } = await import("@/lib/charts");
  const charts = getAllCharts();

  return charts.map((chart) => ({
    slug: chart.slug,
  }));
}