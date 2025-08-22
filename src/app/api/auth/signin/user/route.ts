import { NextRequest, NextResponse } from "next/server";
import { signInUser } from "@/auth"; // Import from your auth.ts
import { signInUserZod } from "@/schemas/userSchema/signInUserSchema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = signInUserZod.parse(body);

    // Use NextAuth signIn
    const result = await signInUser("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }
}
