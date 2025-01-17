import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from "next/server"
import prismadb from "@/lib/prismadb"

export async function GET (
    _req: Request,
    { params } : { params: { entryId: string } }
  ) {
    try {
      const { userId }: { userId: string | null } = await auth();

      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }
  
      if(!params.entryId) {
        return new NextResponse("Entry id is requierd", { status : 400 });
      }

      const entry = await prismadb.entry.findUnique({
        where:{
          id: params.entryId,
        }
      })
  
  
      return NextResponse.json(entry);
    } catch (error) {
      console.log('[ENTRY_GET]', error)
      return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
  req: Request,
  { params } : { params: { articleId: string, entryId : string } }
) {
  try {
    const { userId }: { userId: string | null } = await auth();
    const body = await req.json()

    if(!userId){
      return new NextResponse("Unauthorized", { status : 401 });
    }

    const { 
      content,
    } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const user = await currentUser();
    const userdb = await prismadb.user.findUnique({
      where: {
        email: user?.primaryEmailAddress?.emailAddress || "",
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const authorId = userdb?.id;

    if(!params.entryId) {
      return new NextResponse("Entry id is requierd", { status : 400 });
    }

    const entryByUserId = await prismadb.entry.findFirst({
      where:{
        id: params.entryId,
        authorId
      }
    })

    if(!entryByUserId){
        return new NextResponse("Unauthorized", {status: 403})
    }

    if(!params.articleId) {
      return new NextResponse("Article id is requierd", { status : 400 });
    }

    const entryByArticle = await prismadb.entry.findFirst({
      where:{
        id: params.entryId,
        articleId: params.articleId
      }
    })

    if(!entryByArticle){
      return new NextResponse("This entry does not belong to this article", {status: 400})
    }

    const entry = await prismadb.entry.updateMany({
      where: {
        id: params.entryId,
      },
      data : {
        content
      }
    })

    return NextResponse.json(entry);
  } catch (error) {
    console.log('[ENTRY_PATCH]', error)
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE (
  _req: Request,
  { params } : { params: { entryId: string } }
) {
  try {
    const { userId } : {userId : string | null} = await auth()

    if(!userId){
      return new NextResponse("Unauthorized", { status : 401 });
    }

    if(!params.entryId) {
      return new NextResponse("Entry id is requierd", { status : 400 });
    }

    const user = await currentUser();
    const userdb = await prismadb.user.findUnique({
      where: {
        email: user?.primaryEmailAddress?.emailAddress || "",
      },
    });
    const authorId = userdb?.id;

    const EntryByUserId = await prismadb.entry.findFirst({
      where:{
        id: params.entryId,
        authorId
      }
    })

    if(!EntryByUserId){
        return new NextResponse("Unauthorized", {status: 403})
    }

    const entry = await prismadb.entry.deleteMany({
      where: {
        id: params.entryId,
      }
    })

    return NextResponse.json(entry);
  } catch (error) {
    console.log('[ENTRY_DELETE]', error)
    return new NextResponse("Internal error", { status: 500 });
  }
}