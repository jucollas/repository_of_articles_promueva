import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server"
import prismadb from "@/lib/prismadb"

export async function GET (
    _req: Request,
    { params } : { params: { tagId: string } }
  ) {
    try {
      const { userId }: { userId: string | null } = await auth();

      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }
  
      if(!params.tagId) {
        return new NextResponse("Tag id is requierd", { status : 400 });
      }

      const tag = await prismadb.tag.findUnique({
        where:{
          id: params.tagId,
        }
      })
  
      return NextResponse.json(tag);
    } catch (error) {
      console.log('[TAG_GET]', error)
      return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
  req: Request,
  { params } : { params: { tagId: string } }
) {
  try {
    const { userId }: { userId: string | null } = await auth();
    const body = await req.json()
    

    if(!userId){
      return new NextResponse("Unauthorized", { status : 401 });
    }

    const { 
      name
    } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const tag = await prismadb.tag.updateMany({
      where:{
        id: params.tagId,
      },
      data:{
        name
      }
    })

    return NextResponse.json(tag);
  } catch (error) {
    console.log('[TAG_PATCH]', error)
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE (
  _req: Request,
  { params } : { params: { tagId: string } }
) {
  try {
    const { userId } : {userId : string | null} = await auth()

    if(!userId){
      return new NextResponse("Unauthorized", { status : 401 });
    }

    if(!params.tagId) {
      return new NextResponse("Tag id is requierd", { status : 400 });
    }

    const tag = await prismadb.tag.deleteMany({
      where: {
        id: params.tagId,
      }
    })

    return NextResponse.json(tag);
  } catch (error) {
    console.log('[TAG_DELETE]', error)
    return new NextResponse("Internal error", { status: 500 });
  }
}