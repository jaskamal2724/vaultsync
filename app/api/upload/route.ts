import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import { v2 as cloudinary } from "cloudinary";
import { Client, ID, Permission, Role, Storage } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID as string)
  .setKey(process.env.APPWRITE_API_KEY as string);

const storage = new Storage(client);

// Ensure "uploads" directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Async handler for file upload
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
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${file.name}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);

      const nodefile = InputFile.fromPath(filepath, filename);
      const response = await storage.createFile(
        process.env.BUCKET_ID as string,
        ID.unique(),
        nodefile,
        [Permission.read(Role.any())]
      );

      const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.BUCKET_ID}/files/${response.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

      uploadedFiles.push({
        name: response.name,
        id: response.$id,
        fileUrl,
        sizeOriginal: response.sizeOriginal.toString(),
        createdAt: response.$createdAt,
      });

      fs.unlinkSync(filepath)
    }

    return NextResponse.json(
      { msg: "file uploaded", uploadedFiles },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "File upload failed", error: error.message },
      { status: 500 }
    );
  }
}
