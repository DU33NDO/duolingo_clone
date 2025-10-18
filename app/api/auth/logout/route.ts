import { NextResponse } from "next/server";
import { deleteSession, verifySession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Get user ID before deleting session
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      const session = await verifySession(token);
      if (session) {
        await connectDB();
        // Set user offline
        await User.findByIdAndUpdate(session.userId, {
          isOnline: false,
          lastSeen: new Date(),
        });
      }
    }

    await deleteSession();
    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error: any) {
    console.error("[v0] Logout error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
