import { NextRequest, NextResponse } from "next/server";
import { signInCaptainZod } from "@/schemas/captainSchema/signInCaptainSchema";
import { signInCaptain } from "@/authCaptian";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = signInCaptainZod.parse(body);

    // Use NextAuth signIn
    const result = await signInCaptain("credentials", {
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
