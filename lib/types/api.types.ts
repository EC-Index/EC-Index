import { z } from "zod";

export const NewsletterRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().optional(),
});

export type NewsletterRequest = z.infer<typeof NewsletterRequestSchema>;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}