import { NextRequest, NextResponse } from "next/server";
import { Client, Storage } from "node-appwrite";

// Initialize Appwrite client outside the handler function to avoid re-initialization on each request
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID || "")
  .setKey(process.env.APPWRITE_API_KEY || "");

// Initialize storage service once
const storage = new Storage(client);
const bucketId = process.env.BUCKET_ID || "";

// Pre-define response objects for common scenarios
const invalidInputResponse = NextResponse.json(
  { message: "File ID is required" },
  { status: 400 }
);

const serverErrorResponse = (error: any) => NextResponse.json(
  { message: "Failed to delete file", error: error.message || String(error) },
  { status: 500 }
);

const successResponse = NextResponse.json(
  { message: "File permanently deleted from storage" },
  { status: 200 }
);

export async function DELETE(req: NextRequest) {
  try {
    // Check if environment variables are properly set
    if (!bucketId) {
      console.error("BUCKET_ID environment variable is not set");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const fileid = body.fileid;

    // Early validation check
    if (!fileid) {
      return invalidInputResponse;
    }

    // Log operation with timestamp
    console.log(` Deleting file with ID: ${fileid}`);

    // Delete file from Appwrite Storage
    await storage.deleteFile(bucketId, fileid);

    return successResponse;
  } catch (error) {
    // Enhanced error logging
    console.error(` Error deleting file:`, {
      error,
      fileid: req.json().then(body => body.fileid).catch(() => "unknown")
    });
    
    return serverErrorResponse(error);
  }
}