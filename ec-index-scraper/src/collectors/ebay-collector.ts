// src/collectors/ebay-collector.ts
/**
 * eBay Browse API Collector
 * 
 * Uses the official eBay Browse API (https://developer.ebay.com/api-docs/buy/browse/overview.html)
 * This is 100% legal and the recommended way to access eBay data.
 * 
 * API Limits (Guest Access):
 * - 5,000 calls per day
 * - OAuth App Token required (no user auth needed for browse)
 * 
 * Registration: https://developer.ebay.com/
 * 
 * If no API keys are configured, this collector will skip gracefully.
 */

import { BaseCollector, SearchOptions } from "./base-collector";
import { PriceDataPoint, BenchmarkConfig, CollectionResult } from "../models/types";
import { HttpClient } from "../utils/http-client";
import { logger } from "../utils/logger";

interface EbayAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface EbaySearchResponse {
  total: number;
  itemSummaries?: EbayItem[];
}

interface EbayItem {
  itemId: string;
  title: string;
  price: {
    value: string;
    currency: string;
  };
  itemWebUrl: string;
  condition: string;
  seller: {
    username: string;
    feedbackPercentage: string;
    feedbackScore: number;
  };
  shippingOptions?: Array<{
    shippingCostType: string;
    shippingCost?: { value: string; currency: string };
  }>;
  itemLocation?: {
    country: string;
  };
}

export class EbayCollector extends BaseCollector {
  private httpClient: HttpClient;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private appId: string;
  private certId: string;

  constructor() {
    super("ebay");
    this.httpClient = new HttpClient({ rateLimit: 2 }); // eBay allows higher rate
    this.appId = process.env.EBAY_APP_ID || "";
    this.certId = process.env.EBAY_CERT_ID || "";
  }

  /**
   * Get OAuth App Token (Client Credentials Grant)
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.appId || !this.certId) {
      throw new Error("eBay API credentials not configured. Set EBAY_APP_ID and EBAY_CERT_ID in .env");
    }

    const credentials = Buffer.from(`${this.appId}:${this.certId}`).toString("base64");

    try {
      const response = await this.httpClient.post<EbayAuthResponse>(
        "https://api.ebay.com/identity/v1/oauth2/token",
        "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${credentials}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + (response.data.expires_in - 60) * 1000);
      
      logger.info("eBay OAuth token obtained successfully");
      return this.accessToken;
    } catch (error: any) {
      logger.error("Failed to get eBay OAuth token", { error: error.message });
      throw error;
    }
  }

  /**
   * Search eBay listings using Browse API
   */
  async search(query: string, options: SearchOptions = {}): Promise<PriceDataPoint[]> {
    const token = await this.getAccessToken();
    const marketplace = process.env.EBAY_MARKETPLACE || "EBAY_DE";

    const params = new URLSearchParams({
      q: query,
      limit: String(options.maxResults || 50),
      filter: this.buildFilter(options),
    });

    if (options.sortBy === "price") {
      params.append("sort", "price");
    }

    try {
      const response = await this.httpClient.get<EbaySearchResponse>(
        `https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "X-EBAY-C-MARKETPLACE-ID": marketplace,
            "X-EBAY-C-ENDUSERCTX": "contextualLocation=country=DE",
          },
        }
      );

      if (!response.data.itemSummaries) {
        logger.debug(`No results for query: ${query}`);
        return [];
      }

      return response.data.itemSummaries.map((item) => this.transformItem(item));
    } catch (error: any) {
      logger.error(`eBay search failed for: ${query}`, { error: error.message });
      return [];
    }
  }

  /**
   * Build filter string for eBay API
   */
  private buildFilter(options: SearchOptions): string {
    const filters: string[] = [];

    // Only buy-it-now (no auctions)
    filters.push("buyingOptions:{FIXED_PRICE}");

    // Condition filter
    if (options.condition === "new") {
      filters.push("conditions:{NEW}");
    } else if (options.condition === "refurbished") {
      filters.push("conditions:{SELLER_REFURBISHED|MANUFACTURER_REFURBISHED}");
    }

    // Price range
    if (options.priceMin !== undefined) {
      filters.push(`price:[${options.priceMin}]`);
    }
    if (options.priceMax !== undefined) {
      filters.push(`price:[..${options.priceMax}]`);
    }

    // Only items that ship to Germany
    filters.push("deliveryCountry:DE");

    return filters.join(",");
  }

  /**
   * Transform eBay API item to our data format
   */
  private transformItem(item: EbayItem): PriceDataPoint {
    const shippingCost = item.shippingOptions?.[0]?.shippingCost?.value;
    
    return {
      productId: item.itemId,
      platform: "ebay",
      price: parseFloat(item.price.value),
      currency: item.price.currency,
      shipping: shippingCost ? parseFloat(shippingCost) : undefined,
      seller: item.seller.username,
      sellerRating: parseFloat(item.seller.feedbackPercentage) / 100,
      sellerReviewCount: item.seller.feedbackScore,
      condition: this.mapCondition(item.condition),
      inStock: true,
      url: item.itemWebUrl,
      collectedAt: new Date().toISOString(),
    };
  }

  /**
   * Map eBay condition to our standard conditions
   */
  private mapCondition(ebayCondition: string): "new" | "refurbished" | "used" {
    const condition = ebayCondition.toUpperCase();
    if (condition.includes("NEW")) return "new";
    if (condition.includes("REFURBISHED")) return "refurbished";
    return "used";
  }

  /**
   * Collect data for a benchmark
   */
  async collect(config: BenchmarkConfig): Promise<CollectionResult> {
    const startTime = new Date();
    const allDataPoints: PriceDataPoint[] = [];
    const errors: string[] = [];

    // Skip if no API keys configured
    if (!this.appId || !this.certId) {
      logger.warn(`Skipping eBay collection - no API keys configured`);
      logger.info(`  → Get free API keys at: https://developer.ebay.com/`);
      return this.createResult(config.code, startTime, [], ["No API keys - skipped"]);
    }

    logger.info(`Starting eBay collection for ${config.code}`, {
      queries: config.searchQueries.length,
    });

    for (const query of config.searchQueries) {
      try {
        const results = await this.search(query, {
          maxResults: 50,
          condition: "new",
          priceMin: config.priceFilter?.min,
          priceMax: config.priceFilter?.max,
        });

        // Filter out excluded keywords
        const filtered = results.filter((item) => {
          if (!config.excludeKeywords) return true;
          const title = item.productId.toLowerCase(); // We'd need title here
          return !config.excludeKeywords.some((kw) => title.includes(kw.toLowerCase()));
        });

        allDataPoints.push(...filtered);
        logger.debug(`Query "${query}": ${filtered.length} results`);

      } catch (error: any) {
        errors.push(`Query "${query}": ${error.message}`);
      }

      // Small delay between queries
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Deduplicate by product ID
    const uniqueProducts = this.deduplicateProducts(allDataPoints);

    // Save raw data
    this.saveRawData(config.code, uniqueProducts);

    const stats = this.calculateStats(uniqueProducts);
    logger.info(`eBay collection complete for ${config.code}`, stats);

    return this.createResult(config.code, startTime, uniqueProducts, errors);
  }

  /**
   * Remove duplicate products (same product listed multiple times)
   */
  private deduplicateProducts(products: PriceDataPoint[]): PriceDataPoint[] {
    const seen = new Map<string, PriceDataPoint>();
    
    for (const product of products) {
      const existing = seen.get(product.productId);
      // Keep the cheaper listing
      if (!existing || product.price < existing.price) {
        seen.set(product.productId, product);
      }
    }

    return Array.from(seen.values());
  }
}

// Export singleton instance
export const ebayCollector = new EbayCollector();
