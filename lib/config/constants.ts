export const CACHE_TIMES = {
  CHARTS: 3600, // 1 hour
  STATIC_PAGES: 86400, // 24 hours
  API: 300, // 5 minutes
} as const;

export const RATE_LIMITS = {
  NEWSLETTER: 5, // requests per minute
  API: 60, // requests per minute
} as const;

export const TIME_RANGES = [
  { value: "7d", label: "7 Days", days: 7 },
  { value: "30d", label: "30 Days", days: 30 },
  { value: "90d", label: "90 Days", days: 90 },
  { value: "6m", label: "6 Months", days: 180 },
  { value: "1y", label: "1 Year", days: 365 },
  { value: "2y", label: "2 Years", days: 730 },
  { value: "all", label: "All Time", days: null },
] as const;

export const PLATFORM_COLORS: Record<string, string> = {
  amazon: "#FF9900",
  ebay: "#E53238",
  temu: "#F97316",
  shein: "#EC4899",
  idealo: "#0066CC",
  geizhals: "#059669",
  check24: "#3B82F6",
  other: "#6B7280",
} as const;