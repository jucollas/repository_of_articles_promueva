import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function POST(
  req: Request,
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name, email } = body;

    if (!userId){
      return new NextResponse("Unauthorized.", {status: 401});
    }

    if (!name){
      return new NextResponse("Name is required.", {status: 400});
    }

    if (!email){
      return new NextResponse("Email is required.", {status: 400});
    }

    const existingUser = await prismadb.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({message : "User already exists." });
    }

    const newUser = await prismadb.user.create({
      data: {
        name,
        email
      },
    });
    
    return NextResponse.json({message : "User added successfully", user: newUser});
    
  } catch (error) {
    console.log('[USER_POST]', error);
    return new NextResponse("Interal error", { status: 500 });
  }
}