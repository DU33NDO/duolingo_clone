import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifySession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all users except the current user
    const users = (await User.find(
      { _id: { $ne: session.userId } },
      { password: 0 }
    ).sort({ isOnline: -1, lastSeen: -1 })) as Array<{
      _id: { toString: () => string };
      username: string;
      email: string;
      avatar?: string;
      isOnline: boolean;
      lastSeen: Date;
    }>;

    return NextResponse.json(
      {
        users: users.map((user) => ({
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          isOnline: user.isOnline,
          lastSeen: user.lastSeen,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[v0] Get users error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
