// app/charts/page.tsx

"use client";

import { useState, useMemo } from "react";
import Section from "@/components/common/Section";
import ChartGrid from "@/components/charts/ChartGrid";
import Button from "@/components/common/Button";
import { getAllCharts, getAllPlatforms, getPlatformDisplayName } from "@/lib/charts";
import { ChartFilter, Platform, ChartCategory } from "@/lib/types";
import { Search, X } from "lucide-react";

export default function ChartsPage() {
  const allCharts = getAllCharts();
  const platforms = getAllPlatforms();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ChartCategory[]>([]);

  const filteredCharts = useMemo(() => {
    return allCharts.filter((chart) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          chart.title.toLowerCase().includes(query) ||
          chart.shortDescription.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Platform filter
      if (selectedPlatforms.length > 0) {
        const matchesPlatform = chart.platforms.some((p) =>
          selectedPlatforms.includes(p)
        );
        if (!matchesPlatform) return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(chart.category)) return false;
      }

      return true;
    });
  }, [allCharts, searchQuery, selectedPlatforms, selectedCategories]);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const toggleCategory = (category: ChartCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPlatforms([]);
    setSelectedCategories([]);
  };

  const hasActiveFilters =
    searchQuery || selectedPlatforms.length > 0 || selectedCategories.length > 0;

  return (
    <div className="bg-white">
      <Section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            All Charts
          </h1>
          <p className="text-lg text-gray-600">
            Explore our complete collection of e-commerce market indicators
          </p>
        </div>
      </Section>

      <Section className="py-12">
        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search charts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="space-y-4">
            {/* Platform Filters */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Platforms
              </label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedPlatforms.includes(platform)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {getPlatformDisplayName(platform)}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filters */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {(["prices", "supply", "discounts", "volatility", "listings", "concentration"] as ChartCategory[]).map(
                  (category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategories.includes(category)
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </Button>
                <span className="text-sm text-gray-500">
                  Showing {filteredCharts.length} of {allCharts.length} charts
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Charts Grid */}
        {filteredCharts.length > 0 ? (
          <ChartGrid charts={filteredCharts} />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">
              No charts found matching your criteria
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </Section>
    </div>
  );
}