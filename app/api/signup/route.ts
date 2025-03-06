import {  createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/firebase";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body correctly
    const {name,  email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName:name, // Store username in Firebase Auth profile
    });

    return NextResponse.json({ message: "User created successfully", email:user.email }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
