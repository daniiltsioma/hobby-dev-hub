import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/dbConnection"; // Adjust the path based on your project structure

export async function GET(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    return NextResponse.json({
      message: "Connected to MongoDB!",
      status: "success",
    });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    return NextResponse.json({
      message: "Error connecting to MongoDB",
      error: error,
    });
  }
}
