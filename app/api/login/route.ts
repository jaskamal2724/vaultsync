import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body correctly
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    const response = await signInWithEmailAndPassword(auth, email, password)
    return NextResponse.json({ message: "Logged In  successfully",name:response.user.displayName}, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
