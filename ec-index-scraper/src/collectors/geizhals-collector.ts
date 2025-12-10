// src/collectors/geizhals-collector.ts
/**
 * Geizhals Price Collector
 * 
 * Collects publicly available price comparison data from Geizhals.de
 * Geizhals is one of the largest price comparison sites in DACH region.
 * 
 * Legal considerations:
 * - Only scrapes publicly accessible pages
 * - Respects rate limits (1 request per 2 seconds)
 * - Identifies itself via User-Agent
 * - Only collects aggregated price data
 */

import * as cheerio from "cheerio";
import { BaseCollector, SearchOptions } from "./base-collector";
import { PriceDataPoint, BenchmarkConfig, CollectionResult } from "../models/types";
import { HttpClient } from "../utils/http-client";
import { logger } from "../utils/logger";

export class GeizhalsCollector extends BaseCollector {
  private httpClient: HttpClient;
  private baseUrl = "https://geizhals.de";

  constructor() {
    super("geizhals");
    // Conservative rate limit
    this.httpClient = new HttpClient({ 
      rateLimit: 0.5, // 1 request per 2 seconds
      maxRetries: 2,
    });
  }

  /**
   * Search Geizhals for products
   */
  async search(query: string, options: SearchOptions = {}): Promise<PriceDataPoint[]> {
    const encodedQuery = encodeURIComponent(query);
    
    // Geizhals search URL
    let url = `${this.baseUrl}/?fs=${encodedQuery}&in=`;
    
    // Add price filter
    if (options.priceMin !== undefined) {
      url += `&bpmin=${options.priceMin}`;
    }
    if (options.priceMax !== undefined) {
      url += `&bpmax=${options.priceMax}`;
    }

    try {
      const response = await this.httpClient.get(url, {
        headers: {
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "de-DE,de;q=0.9",
        },
      });

      return this.parseSearchResults(response.data, options.maxResults || 30);
    } catch (error: any) {
      logger.error(`Geizhals search failed for: ${query}`, { error: error.message });
      return [];
    }
  }

  /**
   * Parse search results HTML
   */
  private parseSearchResults(html: string, maxResults: number): PriceDataPoint[] {
    const $ = cheerio.load(html);
    const products: PriceDataPoint[] = [];

    // Geizhals product list items
    $(".productlist__product, .listview__item, .product").each((i, el) => {
      if (products.length >= maxResults) return false;

      try {
        const $item = $(el);
        
        // Extract product data
        const title = $item.find(".productlist__name, .listview__name, .product__name, a[data-name]").first().text().trim() 
          || $item.find("a").first().attr("data-name") || "";
        
        // Geizhals shows "ab X,XX €" for lowest price
        const priceText = $item.find(".productlist__price, .listview__price, .price").first().text().trim();
        const price = this.parseGermanPrice(priceText);
        
        const link = $item.find("a").first().attr("href");
        
        // Number of offers
        const offersText = $item.find(".productlist__offerscount, .listview__offers").text();
        const offerCount = parseInt(offersText.match(/\d+/)?.[0] || "0");
        
        if (title && price && price > 0) {
          products.push({
            productId: this.generateProductId(title, link),
            platform: "geizhals",
            price,
            currency: "EUR",
            condition: "new",
            inStock: offerCount > 0,
            url: link ? (link.startsWith("http") ? link : `${this.baseUrl}${link}`) : this.baseUrl,
            collectedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        // Skip malformed items
      }
    });

    logger.debug(`Geizhals: Parsed ${products.length} products from search results`);
    return products;
  }

  /**
   * Parse German price format
   * "ab 123,45 €" -> 123.45
   */
  private parseGermanPrice(priceText: string): number {
    if (!priceText) return 0;
    
    // Remove "ab", currency symbol, whitespace
    const cleaned = priceText
      .replace(/ab\s*/i, "")
      .replace(/[€\s]/g, "")
      .replace(".", "") // thousand separator
      .replace(",", "."); // decimal separator
    
    const price = parseFloat(cleaned);
    return isNaN(price) ? 0 : price;
  }

  /**
   * Generate product ID
   */
  private generateProductId(title: string, url?: string): string {
    // Try to extract Geizhals product ID from URL
    if (url) {
      const match = url.match(/\/(\d+)(?:\.html)?/);
      if (match) return `gh_${match[1]}`;
    }
    
    // Hash of title
    const hash = title.split("").reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    
    return `gh_${Math.abs(hash)}`;
  }

  /**
   * Collect data for a benchmark
   */
  async collect(config: BenchmarkConfig): Promise<CollectionResult> {
    const startTime = new Date();
    const allDataPoints: PriceDataPoint[] = [];
    const errors: string[] = [];

    logger.info(`Starting Geizhals collection for ${config.code}`, {
      queries: config.searchQueries.length,
    });

    for (const query of config.searchQueries) {
      try {
        const results = await this.search(query, {
          maxResults: 25,
          priceMin: config.priceFilter?.min,
          priceMax: config.priceFilter?.max,
        });

        allDataPoints.push(...results);
        logger.debug(`Query "${query}": ${results.length} results`);

        // Respectful delay between queries
        await new Promise(resolve => setTimeout(resolve, 2500));

      } catch (error: any) {
        errors.push(`Query "${query}": ${error.message}`);
      }
    }

    // Deduplicate
    const uniqueProducts = this.deduplicateByPrice(allDataPoints);

    // Save raw data
    this.saveRawData(config.code, uniqueProducts);

    const stats = this.calculateStats(uniqueProducts);
    logger.info(`Geizhals collection complete for ${config.code}`, stats);

    return this.createResult(config.code, startTime, uniqueProducts, errors);
  }

  /**
   * Deduplicate, keep lowest price
   */
  private deduplicateByPrice(products: PriceDataPoint[]): PriceDataPoint[] {
    const seen = new Map<string, PriceDataPoint>();
    
    for (const product of products) {
      const existing = seen.get(product.productId);
      if (!existing || product.price < existing.price) {
        seen.set(product.productId, product);
      }
    }

    return Array.from(seen.values());
  }
}

export const geizhalsCollector = new GeizhalsCollector();
