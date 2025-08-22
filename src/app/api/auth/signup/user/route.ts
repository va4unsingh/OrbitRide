import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { signUpZod } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedBody = signUpZod.safeParse(body);

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

    const { fullname, email, password } = parsedBody.data;

    await dbConnect();

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered" },
        { status: 400 }
      );
    }

    const newUser = await UserModel.create({
      email,
      password,
      fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname,
      },
    });

    const userWithoutPassword = await UserModel.findById(newUser._id).select(
      "-password"
    );
    return NextResponse.json(
      {
        message: "User registered successfully",
        success: true,
        user: userWithoutPassword,
      },

      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error", error);

    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 400 }
    );
  }
}
