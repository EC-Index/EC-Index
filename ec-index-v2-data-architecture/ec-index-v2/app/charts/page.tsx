// app/charts/page.tsx
/**
 * Charts Index Page
 * 
 * Displays all available charts in a grid view.
 */

import { getAllCharts, getBenchmarkCharts } from "../../lib/charts";
import { getChartSeries } from "../../lib/services/chart-service";
import Section from "../../components/common/Section";
import ChartCard from "../../components/charts/ChartCard";

export default function ChartsPage() {
  const allCharts = getAllCharts();
  const benchmarkCharts = getBenchmarkCharts();
  const otherCharts = allCharts.filter((c) => c.benchmarkCode === null);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <Section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EC-Index Charts
          </h1>
          <p className="text-lg text-gray-600">
            Explore our collection of e-commerce market indices. Track prices,
            supply levels, discounts, and market dynamics across major platforms.
          </p>
        </div>
      </Section>

      {/* Official Benchmarks */}
      <Section className="py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Official Benchmarks
          </h2>
          <p className="text-gray-600">
            Our flagship indices with the highest data quality and consistency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benchmarkCharts.map((chart) => {
            const series = getChartSeries(chart.slug);
            return (
              <ChartCard
                key={chart.slug}
                slug={chart.slug}
                title={chart.title}
                shortDescription={chart.shortDescription}
                category={chart.category}
                platforms={chart.platforms}
                chartType={chart.chartType}
                previewMetric={chart.previewMetric}
                series={series}
                featured={chart.featured}
                benchmarkCode={chart.benchmarkCode}
              />
            );
          })}
        </div>
      </Section>

      {/* Additional Charts */}
      {otherCharts.length > 0 && (
        <Section className="py-12 bg-gray-50">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Additional Analytics
            </h2>
            <p className="text-gray-600">
              More insights into e-commerce market dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCharts.map((chart) => {
              const series = getChartSeries(chart.slug);
              return (
                <ChartCard
                  key={chart.slug}
                  slug={chart.slug}
                  title={chart.title}
                  shortDescription={chart.shortDescription}
                  category={chart.category}
                  platforms={chart.platforms}
                  chartType={chart.chartType}
                  previewMetric={chart.previewMetric}
                  series={series}
                  featured={chart.featured}
                  benchmarkCode={chart.benchmarkCode}
                />
              );
            })}
          </div>
        </Section>
      )}

      {/* CTA Section */}
      <Section className="py-16 bg-blue-600 text-white">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Need Custom Analytics?</h2>
          <p className="text-blue-100 mb-6">
            We can create custom indices tailored to your specific market
            segments and competitive intelligence needs.
          </p>
          <a
            href="/pricing"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            View Enterprise Plans
          </a>
        </div>
      </Section>
    </div>
  );
}
