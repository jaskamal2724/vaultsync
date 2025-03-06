import {  NextRequest, NextResponse } from "next/server";
import { Client, Databases } from "node-appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID as string)
  .setKey(process.env.APPWRITE_API_KEY as string);

const databases = new Databases(client);

export async function DELETE(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    // Get fileId from params
    console.log(req.method)
    const { fileId } = params;
    console.log(fileId);
    
    // Validate input
    if (!fileId) {
      return NextResponse.json(
        { message: "File ID is required" },
        { status: 400 }
      );
    }

    // Delete document by ID
    await databases.deleteDocument(
      process.env.DATABASE_ID as string,
      process.env.COLLECTION_ID as string,
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
