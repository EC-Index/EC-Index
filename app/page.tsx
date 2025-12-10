"use client";

// app/page.tsx

import Link from "next/link";
import Button from "@/components/common/Button";
import Section from "@/components/common/Section";
import ChartGrid from "@/components/charts/ChartGrid";
import { getFeaturedCharts } from "@/lib/charts";
import {
  TrendingUp,
  Shield,
  Newspaper,
  Users,
  LineChart,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  const featuredCharts = getFeaturedCharts();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            EC-Index
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4">
            The E-Commerce Index
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We publish cross-platform charts on prices, supply, and trends in
            e-commerce. Independent, data-driven insights for sellers,
            analysts, and media.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="#charts">Explore Charts</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#waitlist">Join the Waitlist</a>
            </Button>
          </div>
        </div>
      </Section>

      {/* Why EC-Index */}
      <Section id="why" className="py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why EC-Index?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The first comprehensive, independent index for e-commerce market
            data
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cross-Platform
            </h3>
            <p className="text-gray-600">
              Data aggregated from Amazon, eBay, Temu, Shein, Idealo, and more
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Independent
            </h3>
            <p className="text-gray-600">
              Unbiased analysis using only publicly available data
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Media-Ready
            </h3>
            <p className="text-gray-600">
              Professional charts ready for publication and citation
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Actionable
            </h3>
            <p className="text-gray-600">
              Insights for sellers, investors, and market analysts
            </p>
          </div>
        </div>
      </Section>

      {/* Flagship Charts */}
      <Section id="charts" className="py-16 md:py-24 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Flagship Charts
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of e-commerce market indicators
          </p>
        </div>

        <ChartGrid charts={featuredCharts} />

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/charts">View All Charts →</Link>
          </Button>
        </div>
      </Section>

      {/* Who is it for? */}
      <Section className="py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Who Is It For?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              E-Commerce Sellers
            </h3>
            <p className="text-gray-600 mb-4">
              Benchmark your pricing, understand market trends, and optimize
              your strategy with data-driven insights.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Track competitor pricing trends</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Identify market opportunities</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Optimize inventory decisions</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <LineChart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Investors & Analysts
            </h3>
            <p className="text-gray-600 mb-4">
              Access comprehensive e-commerce market data for investment
              research and quantitative analysis.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Market trend analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Cross-platform comparisons</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Sector performance tracking</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Newspaper className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Media & Researchers
            </h3>
            <p className="text-gray-600 mb-4">
              Reliable, citable data and charts for journalism, academic
              research, and market reports.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Professional, publication-ready charts</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Transparent methodology</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Historical trend data</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Methodology Teaser */}
      <Section className="py-16 md:py-24 bg-blue-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transparent Methodology
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            All our data comes from publicly accessible sources. We aggregate,
            analyze, and present marketplace data without using any private or
            restricted information.
          </p>
          <p className="text-gray-600 mb-8">
            Our approach ensures compliance with data protection regulations
            while providing valuable market insights. No individual merchant
            data is exposed.
          </p>
          <Button variant="outline" asChild>
            <Link href="/methodology">Learn About Our Methodology →</Link>
          </Button>
        </div>
      </Section>

      {/* Waitlist */}
      <Section id="waitlist" className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join the Waitlist
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Be the first to know when we launch new features, premium data
            access, and API capabilities.
          </p>

          <form
            className="flex flex-col sm:flex-row gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get("email");

              fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, source: "homepage" }),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.success) {
                    alert("Thanks for joining! We'll be in touch soon.");
                    e.currentTarget.reset();
                  }
                })
                .catch(() => {
                  alert("Something went wrong. Please try again.");
                });
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" size="lg">
              Join Waitlist
            </Button>
          </form>
        </div>
      </Section>
    </div>
  );
}
