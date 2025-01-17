import { NextResponse } from "next/server";
import { auth, currentUser } from '@clerk/nextjs/server';
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params } : { params: { articleId: string } }
) {
  try {
    const { userId }: { userId: string | null } = await auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const articleBy = prismadb.article.findUnique({
      where:{
        id: params.articleId,
      }
    })

    if(!articleBy){
      return new NextResponse("Article is requierd", {"status" : 400})
    }
    
    const body = await req.json();
    const { 
      content,
    } = body;

    if(!content){
      return new NextResponse("Content is requierd", {"status" : 400})
    }

    const userInfo = await currentUser();
    const user = await prismadb.user.findUnique({
      where: {
        email: userInfo?.primaryEmailAddress?.emailAddress || "",
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const entry = await prismadb.entry.create({
      data: {
        content,
        author: {connect: {id: user.id}},
        article: {connect: {id: params.articleId}} 
      }
    })

    return NextResponse.json(entry);
  } catch (error) {
    console.error("[ENTRY_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

/*export async function GET(
    _req: Request,
  ) {
    try{
      const { userId }: { userId: string | null } = await auth();

      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }

      const articles = await prismadb.article.findMany();
      
      return NextResponse.json(articles);
    } catch (error) {
      console.log('[ARTICLES_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }*/