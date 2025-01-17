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
      title,
      description,
      authors,
      category,
      downloadUrl,
    } = body;

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    if (!description){
      return new NextResponse("Description is required", { status: 400 });
    }

    if (!authors){
      return new NextResponse("Authors is required", { status: 400 });
    }

    if (!category){
      return new NextResponse("Category is required", { status: 400 });
    }

    if (!downloadUrl){
      return new NextResponse("Download Url is required", { status: 400 });
    }

    const user = await currentUser();
    const userdb = await prismadb.user.findUnique({
      where: {
        email: user?.primaryEmailAddress?.emailAddress || "",
      },
    });

    if (!userdb) {
      return new NextResponse("User not found", { status: 404 });
    }

    const article = await prismadb.article.create({
      data: {
        title,
        description,
        authors,
        category,
        downloadUrl,
        author: {connect: {id: userdb.id}}
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("[ARTICLE_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
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
  }