// app/api/newsletter/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/utils/rate-limit";
import { RATE_LIMITS } from "@/lib/config/constants";

const NewsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.ip || request.headers.get("x-forwarded-for") || "anonymous";
    
    // Rate limiting
    const rateLimitResult = rateLimit(`newsletter:${ip}`, RATE_LIMITS.NEWSLETTER);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Too many requests. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED",
          },
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMITS.NEWSLETTER.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const validation = NewsletterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid input",
            code: "VALIDATION_ERROR",
            details: validation.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { email, source } = validation.data;

    // TODO: Save to database or send to email service
    // For now, just log
    console.log("Newsletter subscription:", {
      email,
      source: source || "unknown",
      timestamp: new Date().toISOString(),
      ip,
    });

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      {
        success: true,
        data: {
          message: "Successfully subscribed to waitlist",
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Newsletter API error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Internal server error",
          code: "INTERNAL_ERROR",
        },
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: "Method not allowed",
        code: "METHOD_NOT_ALLOWED",
      },
    },
    { status: 405 }
  );
}