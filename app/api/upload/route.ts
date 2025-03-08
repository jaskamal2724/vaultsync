import { NextRequest, NextResponse } from "next/server";
import { Client, ID, Permission, Role, Storage } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID as string)
  .setKey(process.env.APPWRITE_API_KEY as string);

const storage = new Storage(client);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Use InputFile.fromBuffer instead of fromPath
      // This doesn't require writing to the filesystem
      const inputFile = InputFile.fromBuffer(
        buffer,
        file.name,
      );
      
      // Upload directly to Appwrite
      const response = await storage.createFile(
        process.env.BUCKET_ID as string,
        ID.unique(),
        inputFile,
        [Permission.read(Role.any())]
      );

      const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.BUCKET_ID}/files/${response.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

      uploadedFiles.push({
        name: response.name,
        $id: response.$id,
        fileUrl,
        sizeOriginal: response.sizeOriginal.toString(),
        createdAt: response.$createdAt,
      });
    }

    return NextResponse.json(
      { msg: "file uploaded", uploadedFiles },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "File upload failed", error: JSON.stringify(error) },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}