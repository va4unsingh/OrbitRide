import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { signInUserZod } from "@/schemas/userSchema/signInUserSchema";
import { signInCaptainZod } from "@/schemas/captainSchema/signInCaptainSchema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { loginAs } = body;

    if (!loginAs || !["user", "captain"].includes(loginAs)) {
      return NextResponse.json(
        {
          message: "Invalid loginAs field",
          error: "loginAs must be either 'user' or 'captain'",
          example: {
            email: "user@example.com",
            password: "password123",
            loginAs: "user",
          },
        },
        { status: 400 }
      );
    }

    let parsedBody;
    if (loginAs === "user") {
      parsedBody = signInUserZod.safeParse(body);
    } else {
      parsedBody = signInCaptainZod.safeParse(body);
    }

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: "Invalid request body",
          errors: parsedBody.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { email, password } = parsedBody.data;

    const result = await signIn("credentials", {
      email,
      password,
      loginAs,
      redirect: false,
    });

    if (result?.error) {
      return NextResponse.json(
        {
          message: "Authentication failed",
          error: result.error,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Login successful as ${loginAs}`,
      userType: loginAs,
      user: {
        email: email,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json(
            {
              message: "Authentication failed",
              error: "Invalid credentials",
            },
            { status: 401 }
          );
        default:
          return NextResponse.json(
            {
              message: "Authentication error",
              error: error.message || "Authentication failed",
            },
            { status: 401 }
          );
      }
    }

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
