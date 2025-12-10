export const siteConfig = {
  name: "EC-Index",
  description: "The reference index for global e-commerce data. Cross-platform insights for sellers, analysts, and media.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ec-index.eu",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/ecindex",
    github: "https://github.com/ecindex",
  },
  creator: "@ecindex",
  keywords: [
    "e-commerce",
    "data analytics",
    "marketplace insights",
    "price trends",
    "amazon",
    "ebay",
    "temu",
    "shein",
  ],
} as const;