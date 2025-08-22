import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { fullname, email, password } = await req.json();


  } catch (error) {}
}
