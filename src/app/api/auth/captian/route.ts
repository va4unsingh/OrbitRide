import dbConnect from "@/lib/dbConnect";
import { signUpCaptainZod } from "@/schemas/captainSchema/signUpCaptainSchema";
import { NextRequest, NextResponse } from "next/server";
import captainModel from "@/models/captain.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedBody = signUpCaptainZod.safeParse(body);

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

    const { fullname, email, password, vehicle } = parsedBody.data;

    await dbConnect();

    const existingCaptain = await captainModel.findOne({ email });

    if (existingCaptain) {
      return NextResponse.json(
        { error: "Captain already registered" },
        { status: 400 }
      );
    }

    const newCaptain = await captainModel.create({
      email,
      password,
      fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname,
      },
      vehicle: {
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType,
      },
    });

    const captainWithoutPassword = await captainModel
      .findById(newCaptain._id)
      .select("-password");

    return NextResponse.json(
      {
        message: "Captain registered successfully",
        success: true,
        captain: captainWithoutPassword,
      },

      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error", error);

    return NextResponse.json(
      { error: "Failed to register captain" },
      { status: 400 }
    );
  }
}
