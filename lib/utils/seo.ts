// lib/utils/seo.ts

import { Metadata } from "next";
import { siteConfig } from "@/lib/config/site.config";
import { ChartDefinition } from "@/lib/types/chart.types";

interface PageSEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Generate metadata for a page
 */
export function generatePageMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: PageSEOProps): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.creator,
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: siteConfig.creator,
    },
    alternates: {
      canonical: url,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

/**
 * Generate metadata for a chart page
 */
export function generateChartMetadata(chart: ChartDefinition): Metadata {
  const title = chart.title;
  const description =
    chart.longDescription || chart.shortDescription || 
    `View ${chart.title} - E-commerce data analysis across ${chart.platforms.join(", ")}`;

  return generatePageMetadata({
    title,
    description,
    path: `/charts/${chart.slug}`,
  });
}

/**
 * Generate structured data (JSON-LD) for charts
 */
export function generateChartStructuredData(chart: ChartDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: chart.title,
    description: chart.longDescription || chart.shortDescription,
    creator: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    dateModified: chart.metadata.lastUpdated,
    keywords: [
      chart.category,
      ...chart.platforms,
      "e-commerce",
      "market data",
    ].join(", "),
  };
}