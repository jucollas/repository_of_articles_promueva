import { NextResponse } from "next/server";
import { auth, currentUser } from '@clerk/nextjs/server';
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId }: { userId: string | null } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    
    const body = await req.json();
    const { 
      name
    } = body;
    
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
  
    const tag = await prismadb.tag.create({
      data: {
        name
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("[TAG_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  ) {
    try{
      const { userId }: { userId: string | null } = await auth();
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }

      const tags = await prismadb.tag.findMany();
      
      return NextResponse.json(tags);
    } catch (error) {
      console.log('[TAGS_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }