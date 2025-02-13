import connectToDatabase from "@/app/lib/mongo/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/lib/mongo/models/Users";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ userId })
      .populate("activeProjects")
      .populate("archivedProjects");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      activeProjects: user.activeProjects,
      archivedProjects: user.archivedProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
}
