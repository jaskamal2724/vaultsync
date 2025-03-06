import { NextRequest, NextResponse } from "next/server";
import { Client, Storage } from "node-appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID as string)
  .setKey(process.env.APPWRITE_API_KEY as string);

const storage = new Storage(client);

export async function DELETE(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    console.log(req.method)
    const { fileId } =await  params;

    console.log("Deleting file from storage with ID:", fileId);

    // Validate input
    if (!fileId) {
      return NextResponse.json(
        { message: "File ID is required" },
        { status: 400 }
      );
    }

    // ✅ Permanently delete file from Appwrite Storage
    await storage.deleteFile(process.env.BUCKET_ID as string, fileId);

    return NextResponse.json(
      { message: "File permanently deleted from storage" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { message: "Failed to delete file", error },
      { status: 500 }
    );
  }
}