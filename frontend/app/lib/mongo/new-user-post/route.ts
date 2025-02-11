import connectToDatabase from "@/app/lib/mongo/dbConnection";
import User from "@/app/lib/mongo/models/Users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectToDatabase();

  try {
    const { email, githubId, userId } = await request.json();

    if (!email || !githubId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let existingUser = await User.findOne({ githubId });

    if (existingUser) {
      return NextResponse.json(
        { message: "User account already exists" },
        { status: 409 }
      );
    }

    const newUser = new User({
      email,
      githubId,
      userId,
      activeProjects: [],
      archivedProjects: [],
    });

    await newUser.save();

    return NextResponse.json(
      { message: "New user account created", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
