// app/api/delete-file/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Client, Databases } from "node-appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

const databases = new Databases(client);

export async function DELETE(request: NextRequest) {
  try {
    // Get the fileId from the request body
    const body = await request.json();
    const { fileId } = body;
    
    // Validate input
    if (!fileId) {
      return NextResponse.json(
        { message: "File ID is required" },
        { status: 400 }
      );
    }

    // Delete document by ID
    await databases.deleteDocument(
      process.env.DATABASE_ID || "",
      process.env.COLLECTION_ID || "",
      fileId
    );
    
    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file:", error);

    return NextResponse.json(
      { 
        message: "Failed to delete file", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

// Also support POST requests for clients that can't send DELETE
export async function POST(request: NextRequest) {
  return DELETE(request);
}