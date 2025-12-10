// src/utils/http-client.ts
/**
 * HTTP Client with rate limiting, retries, and proper headers
 * 
 * This client ensures we're being respectful to the servers:
 * - Rate limiting (configurable requests per second)
 * - Exponential backoff on failures
 * - Proper User-Agent identification
 * - Respects robots.txt (manual check required)
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { logger } from "./logger";

interface HttpClientConfig {
  baseURL?: string;
  rateLimit?: number; // requests per second
  maxRetries?: number;
  timeout?: number;
}

class RateLimiter {
  private lastRequest: number = 0;
  private minInterval: number;

  constructor(requestsPerSecond: number) {
    this.minInterval = 1000 / requestsPerSecond;
  }

  async wait(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequest;
    
    if (elapsed < this.minInterval) {
      const waitTime = this.minInterval - elapsed;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequest = Date.now();
  }
}

export class HttpClient {
  private client: AxiosInstance;
  private rateLimiter: RateLimiter;
  private maxRetries: number;

  constructor(config: HttpClientConfig = {}) {
    const rateLimit = config.rateLimit || 1;
    this.maxRetries = config.maxRetries || 3;
    this.rateLimiter = new RateLimiter(rateLimit);

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        // Identify ourselves properly - this is important for legal compliance
        "User-Agent": "EC-Index-DataCollector/1.0 (https://ec-index.eu; contact@ec-index.eu) - Market Research Bot",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
      },
    });
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  private async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        // Wait for rate limiter
        await this.rateLimiter.wait();

        logger.debug(`HTTP ${config.method} ${config.url} (attempt ${attempt})`);
        
        const response = await this.client.request<T>(config);
        
        logger.debug(`HTTP ${response.status} ${config.url}`);
        
        return response;
      } catch (error: any) {
        lastError = error;
        
        const status = error.response?.status;
        const isRetryable = !status || status >= 500 || status === 429;

        if (!isRetryable || attempt === this.maxRetries) {
          logger.error(`HTTP failed: ${config.url}`, {
            status,
            message: error.message,
            attempt,
          });
          throw error;
        }

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        logger.warn(`HTTP retry in ${delay}ms: ${config.url}`, { status, attempt });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

// Default client instance
export const httpClient = new HttpClient({
  rateLimit: parseFloat(process.env.RATE_LIMIT_RPS || "1"),
  maxRetries: parseInt(process.env.MAX_RETRIES || "3"),
});
