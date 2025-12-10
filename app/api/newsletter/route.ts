// app/api/newsletter/route.ts

import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting (Next.js 16 compatible)
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "anonymous";

    // Parse and validate body
    const body = await request.json();
    const { email, source } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // TODO: In production, save to database or send to email service
    // For now, just log to console
    console.log("Newsletter subscription:", {
      email,
      source: source || "unknown",
      timestamp: new Date().toISOString(),
      ip,
    });

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to waitlist",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}