// app/methodology/page.tsx

import Section from "@/components/common/Section";
import Button from "@/components/common/Button";
import Link from "next/link";
import { Shield, Database, Scale, TrendingUp } from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <Section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Methodology
          </h1>
          <p className="text-lg text-gray-600">
            Transparent, compliant, and reliable e-commerce data analysis
          </p>
        </div>
      </Section>

      {/* Core Principles */}
      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Core Principles
          </h2>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Public Data Only
                </h3>
                <p className="text-gray-600">
                  At this MVP stage, EC-Index exclusively aggregates and
                  analyzes publicly accessible e-commerce data. This includes
                  product listings, prices, and other information that is
                  freely available on marketplace websites and price comparison
                  platforms. We do not use any restricted, private, or
                  non-public data sources, including DMA (Digital Markets Act)
                  regulated data that is not yet publicly available.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Privacy & Compliance
                </h3>
                <p className="text-gray-600">
                  We are committed to full compliance with GDPR, data
                  protection regulations, and platform terms of service. Our
                  data collection and processing methods respect user privacy
                  and merchant confidentiality. No individual merchant data,
                  personal information, or trade secrets are exposed or
                  published. All data is aggregated and anonymized to show
                  market-level trends only.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Legal & Ethical Standards
                </h3>
                <p className="text-gray-600">
                  Our data aggregation practices are designed to be fully legal
                  and ethical. We respect robots.txt directives, rate limits,
                  and platform policies. Our focus is on creating value through
                  analysis and insights, not on unauthorized access or misuse
                  of data. We continuously monitor regulatory developments and
                  adjust our practices accordingly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Quality & Accuracy
                </h3>
                <p className="text-gray-600">
                  We apply rigorous data quality checks and validation
                  processes to ensure accuracy. Outliers are identified and
                  handled appropriately, and data inconsistencies are
                  investigated. Our charts include clear metadata about sample
                  sizes, update frequencies, and methodological limitations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Data Sources */}
      <Section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Data Sources (MVP Stage)
          </h2>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Current Sources
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">•</span>
                <span>
                  <strong>Marketplaces:</strong> Public product listings,
                  prices, and availability data from platforms like Amazon,
                  eBay, and other major marketplaces
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">•</span>
                <span>
                  <strong>Price Comparison Sites:</strong> Aggregated pricing
                  data from Idealo, Geizhals, Check24, and similar platforms
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">•</span>
                <span>
                  <strong>Public APIs:</strong> Where available, we use
                  official public APIs provided by platforms
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">•</span>
                <span>
                  <strong>Web Scraping:</strong> Ethical web scraping of
                  publicly accessible data, respecting robots.txt and rate
                  limits
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Future Expansion
            </h3>
            <p className="text-gray-600 mb-4">
              As regulations evolve and new data sources become available, we
              plan to expand our coverage:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">•</span>
                <span>
                  DMA-mandated data access (when publicly available and
                  compliant)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">•</span>
                <span>Additional regional marketplaces and platforms</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">•</span>
                <span>Social commerce and emerging channels</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 mt-1">•</span>
                <span>
                  Partnerships with data providers for enhanced coverage
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Data Processing */}
      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Data Processing & Analysis
          </h2>

          <div className="prose prose-gray max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Aggregation Methods
            </h3>
            <p className="text-gray-600 mb-6">
              We aggregate raw data into meaningful market indicators using
              statistical methods appropriate for each metric. Price data is
              typically averaged or median-calculated to reduce the impact of
              outliers. Volume metrics use simple counts and sums. Trends are
              calculated using time-series analysis techniques.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Anonymization
            </h3>
            <p className="text-gray-600 mb-6">
              Individual seller identities, specific product details that could
              identify merchants, and other potentially sensitive information
              are removed or aggregated. Our charts show market-level patterns,
              not individual merchant performance.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Update Frequency
            </h3>
            <p className="text-gray-600 mb-6">
              Different charts have different update frequencies based on data
              availability and the nature of the metric. Most charts are
              updated weekly or bi-weekly. Each chart page displays the last
              update timestamp and data freshness information.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Quality Assurance
            </h3>
            <p className="text-gray-600">
              We implement automated checks for data quality, including outlier
              detection, missing data handling, and consistency validation
              across sources. Any anomalies or data quality issues are flagged
              and investigated before charts are published.
            </p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is this data legally collected?
              </h3>
              <p className="text-gray-600">
                Yes. We only collect publicly accessible data in compliance
                with applicable laws, regulations, and platform terms of
                service. We do not use any unauthorized access methods or
                restricted data sources.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Will you expose individual seller data?
              </h3>
              <p className="text-gray-600">
                No. All data is aggregated at the market level. We do not
                publish individual seller performance, specific merchant
                identities, or any information that could be used to identify
                or disadvantage specific businesses.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How accurate is the data?
              </h3>
              <p className="text-gray-600">
                We strive for high accuracy through rigorous data validation
                and quality checks. However, as with any aggregated market
                data, there are inherent limitations based on sampling, data
                availability, and methodology. We clearly document these
                limitations for each chart.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I use these charts in my reports?
              </h3>
              <p className="text-gray-600">
                For now, all charts on our website are free to view. For
                commercial use, media publication, or embedding in reports,
                please join our waitlist to be notified when we launch our
                licensing options.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Questions About Our Methodology?
          </h2>
          <p className="text-gray-600 mb-6">
            We're committed to transparency and welcome questions about our
            data sources and methods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/charts">Explore Our Charts</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/#waitlist">Join the Waitlist</Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}