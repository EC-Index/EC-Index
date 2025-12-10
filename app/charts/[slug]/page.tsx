// app/charts/[slug]/page.tsx
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
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

  const series = getChartSeries(slug);
  const isBenchmark = isOfficialBenchmark(slug);
  const benchmarkCodeMatch = chart.title.match(/\(([^)]+)\)/);
  const benchmarkCode = benchmarkCodeMatch ? benchmarkCodeMatch[1] : null;

  const chartData = {
    title: chart.title,
    chartType: chart.chartType,
    yAxisLabel: chart.yAxisLabel,
    xAxisLabel: chart.xAxisLabel,
  };

  return (
    <div className="bg-white">
      <Section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="mb-4">
          <Link href="/charts" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Charts
          </Link>
        </div>
        <div className="max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {isBenchmark && <Badge variant="featured">Official Benchmark</Badge>}
            {benchmarkCode && <Badge variant="default">{benchmarkCode}</Badge>}
            {chart.platforms.map((platform) => (
              <Tag key={platform} variant="platform">{platform}</Tag>
            ))}
            <Tag variant="category">{chart.category}</Tag>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{chart.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{chart.longDescription || chart.shortDescription}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div><span className="font-medium">Last Updated:</span> {formatDate(chart.metadata.lastUpdated)}</div>
            <div><span className="font-medium">Data Source:</span> {chart.metadata.dataSource}</div>
            {chart.metadata.sampleSize && <div><span className="font-medium">Sample Size:</span> {chart.metadata.sampleSize}</div>}
          </div>
        </div>
      </Section>
      <Section className="py-4 bg-amber-50 border-b border-amber-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Note:</strong> This chart currently displays mock data for demonstration purposes.
          </div>
        </div>
      </Section>
      <Section className="py-12">
        <ChartDetail chart={chartData} series={series} />
      </Section>
      <Section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Chart Methodology</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-700 mb-4">{chart.metadata.methodology || chart.longDescription}</p>
          </div>
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/methodology">Learn More About Our Data Sources</Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

export async function generateStaticParams() {
  const { getAllCharts } = await import("@/lib/charts");
  return getAllCharts().map((chart) => ({ slug: chart.slug }));
}
