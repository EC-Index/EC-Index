// components/layout/Footer.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white">EC-Index</span>
            </Link>
            <p className="text-gray-400 mb-4">
              The reference index for global e-commerce data. Independent,
              cross-platform insights for sellers, analysts, and media.
            </p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} EC-Index. All rights reserved.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/charts"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Charts
                </Link>
              </li>
              <li>
                <Link
                  href="/methodology"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Imprint
                </Link>
              </li>
              <li>
                <Link
                  href="/#waitlist"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>
            EC-Index is an independent platform providing aggregated e-commerce
            market data. We are not affiliated with any marketplace or platform.
          </p>
        </div>
      </div>
    </footer>
  );
}