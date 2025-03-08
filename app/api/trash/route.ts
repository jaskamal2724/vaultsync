import { NextRequest, NextResponse } from "next/server";
import { Client, Databases, ID, Permission, Role } from "node-appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID as string)
  .setKey(process.env.APPWRITE_API_KEY as string);

const databases = new Databases(client);

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const { name, $id } = await req.json();

    // Validate input
    if (!name || !$id) {
      return NextResponse.json(
        { message: "Filename and File ID are required" },
        { status: 400 }
      );
    }

    // Create document in trash collection
    const response = await databases.createDocument(
      process.env.DATABASE_ID as string,
      process.env.COLLECTION_ID as string,
      ID.unique(),
      {
        // Required fields
        name: name,
        fileid: $id,
      },
      [Permission.read(Role.any())]
    );

    return NextResponse.json(
      {
        message: "File moved to trash successfully",
        trashDocument: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error moving file to trash:", error);

    // Detailed error response
    return NextResponse.json(
      {
        message: "Failed to move file to trash",
        error: error
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Fetch all documents from the collection
    const response = await databases.listDocuments(
      process.env.DATABASE_ID as string,
      process.env.COLLECTION_ID as string
    );

    return NextResponse.json(
      {
        message: "Fetched all documents successfully",
        documents: response.documents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching documents:", error);

    return NextResponse.json(
      { message: "Failed to fetch documents", error: error },
      { status: 500 }
    );
  }
}




