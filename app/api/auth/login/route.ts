import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { setSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Please provide email and password" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = (await User.findOne({ email })) as {
      _id: string;
      username: string;
      email: string;
      password: string;
    };

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Set session
    await setSession(user._id.toString(), user.username, user.email);

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[v0] Login error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
