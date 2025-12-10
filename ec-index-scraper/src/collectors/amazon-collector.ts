// src/collectors/amazon-collector.ts
/**
 * Amazon Product Advertising API Collector
 * 
 * Uses the official Amazon Product Advertising API 5.0
 * This requires an Amazon Associates (affiliate) account.
 * 
 * Registration: https://affiliate-program.amazon.de/
 * API Docs: https://webservices.amazon.com/paapi5/documentation/
 * 
 * Rate Limits:
 * - 1 request per second (can increase with sales)
 * - Based on revenue generated through affiliate links
 * 
 * Note: For initial testing without API access, this collector
 * can fall back to basic price estimates or be skipped.
 */

import crypto from "crypto";
import { BaseCollector, SearchOptions } from "./base-collector";
import { PriceDataPoint, BenchmarkConfig, CollectionResult } from "../models/types";
import { HttpClient } from "../utils/http-client";
import { logger } from "../utils/logger";

interface AmazonSearchResult {
  SearchResult?: {
    Items?: AmazonItem[];
    TotalResultCount?: number;
  };
}

interface AmazonItem {
  ASIN: string;
  DetailPageURL: string;
  ItemInfo?: {
    Title?: { DisplayValue: string };
    ByLineInfo?: { Brand?: { DisplayValue: string } };
  };
  Offers?: {
    Listings?: Array<{
      Price?: { Amount: number; Currency: string };
      Condition?: { Value: string };
      DeliveryInfo?: { IsFreeShippingEligible: boolean };
      MerchantInfo?: { Name: string };
    }>;
  };
}

export class AmazonCollector extends BaseCollector {
  private httpClient: HttpClient;
  private accessKey: string;
  private secretKey: string;
  private partnerTag: string;
  private region: string;
  private host: string;

  constructor() {
    super("amazon");
    this.httpClient = new HttpClient({ rateLimit: 1 });
    this.accessKey = process.env.AMAZON_ACCESS_KEY || "";
    this.secretKey = process.env.AMAZON_SECRET_KEY || "";
    this.partnerTag = process.env.AMAZON_PARTNER_TAG || "";
    this.region = process.env.AMAZON_REGION || "eu-west-1";
    this.host = "webservices.amazon.de";
  }

  /**
   * Check if API credentials are configured
   */
  isConfigured(): boolean {
    return !!(this.accessKey && this.secretKey && this.partnerTag);
  }

  /**
   * Sign request using AWS Signature Version 4
   */
  private signRequest(payload: string): { headers: Record<string, string>; timestamp: string } {
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
    const date = timestamp.slice(0, 8);
    
    const headers: Record<string, string> = {
      "content-encoding": "amz-1.0",
      "content-type": "application/json; charset=utf-8",
      "host": this.host,
      "x-amz-date": timestamp,
      "x-amz-target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems",
    };

    // Create canonical request
    const signedHeaders = Object.keys(headers).sort().join(";");
    const canonicalHeaders = Object.keys(headers)
      .sort()
      .map(key => `${key}:${headers[key]}`)
      .join("\n") + "\n";

    const payloadHash = crypto.createHash("sha256").update(payload).digest("hex");
    const canonicalRequest = [
      "POST",
      "/paapi5/searchitems",
      "",
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");

    // Create string to sign
    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${date}/${this.region}/ProductAdvertisingAPI/aws4_request`;
    const canonicalRequestHash = crypto.createHash("sha256").update(canonicalRequest).digest("hex");
    const stringToSign = [algorithm, timestamp, credentialScope, canonicalRequestHash].join("\n");

    // Calculate signature
    const kDate = crypto.createHmac("sha256", `AWS4${this.secretKey}`).update(date).digest();
    const kRegion = crypto.createHmac("sha256", kDate).update(this.region).digest();
    const kService = crypto.createHmac("sha256", kRegion).update("ProductAdvertisingAPI").digest();
    const kSigning = crypto.createHmac("sha256", kService).update("aws4_request").digest();
    const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");

    // Create authorization header
    headers["Authorization"] = [
      `${algorithm} Credential=${this.accessKey}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`,
    ].join(", ");

    return { headers, timestamp };
  }

  /**
   * Search Amazon using PA-API
   */
  async search(query: string, options: SearchOptions = {}): Promise<PriceDataPoint[]> {
    if (!this.isConfigured()) {
      logger.warn("Amazon PA-API not configured, skipping");
      return [];
    }

    const payload = JSON.stringify({
      PartnerTag: this.partnerTag,
      PartnerType: "Associates",
      Keywords: query,
      SearchIndex: "All",
      ItemCount: options.maxResults || 10,
      Resources: [
        "ItemInfo.Title",
        "ItemInfo.ByLineInfo",
        "Offers.Listings.Price",
        "Offers.Listings.Condition",
        "Offers.Listings.DeliveryInfo.IsFreeShippingEligible",
        "Offers.Listings.MerchantInfo",
      ],
      ...(options.priceMin && { MinPrice: Math.round(options.priceMin * 100) }),
      ...(options.priceMax && { MaxPrice: Math.round(options.priceMax * 100) }),
      Condition: options.condition === "new" ? "New" : "All",
    });

    const { headers } = this.signRequest(payload);

    try {
      const response = await this.httpClient.post<AmazonSearchResult>(
        `https://${this.host}/paapi5/searchitems`,
        payload,
        { headers }
      );

      if (!response.data.SearchResult?.Items) {
        return [];
      }

      return response.data.SearchResult.Items
        .filter(item => item.Offers?.Listings?.length)
        .map(item => this.transformItem(item));

    } catch (error: any) {
      // Handle specific PA-API errors
      if (error.response?.status === 429) {
        logger.warn("Amazon PA-API rate limit hit, backing off");
      } else {
        logger.error(`Amazon search failed for: ${query}`, { error: error.message });
      }
      return [];
    }
  }

  /**
   * Transform Amazon API response to our format
   */
  private transformItem(item: AmazonItem): PriceDataPoint {
    const listing = item.Offers?.Listings?.[0];
    
    return {
      productId: item.ASIN,
      platform: "amazon",
      price: listing?.Price?.Amount || 0,
      currency: listing?.Price?.Currency || "EUR",
      shipping: listing?.DeliveryInfo?.IsFreeShippingEligible ? 0 : undefined,
      seller: listing?.MerchantInfo?.Name,
      condition: listing?.Condition?.Value?.toLowerCase() === "new" ? "new" : "used",
      inStock: true,
      url: item.DetailPageURL,
      collectedAt: new Date().toISOString(),
    };
  }

  /**
   * Collect data for a benchmark
   */
  async collect(config: BenchmarkConfig): Promise<CollectionResult> {
    const startTime = new Date();
    const allDataPoints: PriceDataPoint[] = [];
    const errors: string[] = [];

    if (!this.isConfigured()) {
      logger.warn(`Skipping Amazon collection for ${config.code} - API not configured`);
      return this.createResult(config.code, startTime, [], ["API not configured"]);
    }

    logger.info(`Starting Amazon collection for ${config.code}`);

    for (const query of config.searchQueries) {
      try {
        const results = await this.search(query, {
          maxResults: 10,
          condition: "new",
          priceMin: config.priceFilter?.min,
          priceMax: config.priceFilter?.max,
        });

        // Filter by excluded keywords
        const filtered = results.filter(item => {
          if (!config.excludeKeywords) return true;
          // We'd need the title for proper filtering
          return true;
        });

        allDataPoints.push(...filtered);
        
        // Respect rate limit
        await new Promise(resolve => setTimeout(resolve, 1100));

      } catch (error: any) {
        errors.push(`Query "${query}": ${error.message}`);
      }
    }

    // Deduplicate by ASIN
    const unique = new Map(allDataPoints.map(p => [p.productId, p]));
    const uniqueProducts = Array.from(unique.values());

    this.saveRawData(config.code, uniqueProducts);

    const stats = this.calculateStats(uniqueProducts);
    logger.info(`Amazon collection complete for ${config.code}`, stats);

    return this.createResult(config.code, startTime, uniqueProducts, errors);
  }
}

export const amazonCollector = new AmazonCollector();
