import { NextResponse } from "next/server";
import { Client, Storage } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject(process.env.APPWRITE_PROJECT_ID as string) // Set project ID
  .setKey(process.env.APPWRITE_API_KEY as string); // Set API Key

const storage = new Storage(client);

export async function GET() {
  try {
    const response = await storage.listFiles(process.env.BUCKET_ID as string);
    if (response) {
      
      const fileswithurl = response.files.map((file) => {
        const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.BUCKET_ID}/files/${file.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
        return {
          ...file,
          fileUrl,
          starred:false
        }
      });

      return NextResponse.json({total:fileswithurl.length,  fileswithurl }, { status: 200 });
    } else {
      return NextResponse.json({ msg: "files not got " }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { msg: "error in fetching files" },
      { status: 5000 }
    );
  }
}
