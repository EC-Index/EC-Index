// app/pricing/page.tsx

import Section from "@/components/common/Section";
import Button from "@/components/common/Button";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <Section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pricing
          </h1>
          <p className="text-lg text-gray-600">
            Flexible plans for individuals, businesses, and institutions
          </p>
        </div>
      </Section>

      {/* Pricing Tiers */}
      <Section className="py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="border border-gray-200 rounded-lg p-8 bg-white">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">€0</div>
              <p className="text-gray-600">Forever free</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Access to all public charts on website
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Weekly data updates
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Interactive chart exploration
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Basic methodology documentation
                </span>
              </li>
            </ul>

            <Button variant="outline" className="w-full" asChild>
              <a href="/charts">Explore Charts</a>
            </Button>
          </div>

          {/* Pro Tier */}
          <div className="border-2 border-blue-600 rounded-lg p-8 bg-white relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                Coming Soon
              </div>
              <p className="text-gray-600">For professionals & small teams</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Everything in Free, plus:</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Export charts as PNG, SVG, CSV
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Access to 50+ additional granular charts
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Daily data updates
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Historical data access (2+ years)
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Custom date range selection
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Priority email support</span>
              </li>
            </ul>

            <Button className="w-full" asChild>
              <a href="/#waitlist">Join Waitlist</a>
            </Button>
          </div>

          {/* Enterprise Tier */}
          <div className="border border-gray-200 rounded-lg p-8 bg-white">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Enterprise
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">Custom</div>
              <p className="text-gray-600">For institutions & media</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Everything in Pro, plus:</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Full API access for data integration
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Embeddable widgets for your site
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Commercial licensing for media use
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Custom charts and analysis
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Dedicated account manager
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">SLA and premium support</span>
              </li>
            </ul>

            <Button variant="outline" className="w-full" asChild>
              <a href="/#waitlist">Contact Sales</a>
            </Button>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Pricing FAQ
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                When will paid plans be available?
              </h3>
              <p className="text-gray-600">
                We're currently in MVP phase with free access to all charts.
                Paid plans with additional features will launch in Q2 2025.
                Join the waitlist to be notified when they become available.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I use free charts commercially?
              </h3>
              <p className="text-gray-600">
                Free tier charts can be used for personal research and internal
                analysis. For commercial use, media publication, or
                redistribution, you'll need a Pro or Enterprise license. We'll
                have clear terms when paid plans launch.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods will you accept?
              </h3>
              <p className="text-gray-600">
                We'll accept major credit cards, wire transfers for Enterprise
                customers, and potentially invoice-based billing for
                institutions. More details when we launch paid tiers.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there an academic discount?
              </h3>
              <p className="text-gray-600">
                Yes! We plan to offer discounted rates for academic
                institutions, researchers, and non-profit organizations. Join
                the waitlist and mention your institution to learn more.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start exploring our free charts today, or join the waitlist to be
            first in line for premium features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/charts">Explore Free Charts</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/#waitlist">Join Waitlist</a>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}