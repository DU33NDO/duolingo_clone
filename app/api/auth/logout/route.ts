import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST() {
  try {
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
