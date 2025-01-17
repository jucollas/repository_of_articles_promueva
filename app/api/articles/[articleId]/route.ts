import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from "next/server"
import prismadb from "@/lib/prismadb"

export async function GET (
    _req: Request,
    { params } : { params: { articleId: string } }
  ) {
    try {
      const { userId }: { userId: string | null } = await auth();

      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }
  
      if(!params.articleId) {
        return new NextResponse("Article id is requierd", { status : 400 });
      }

      const article = await prismadb.article.findUnique({
        where:{
          id: params.articleId,
        }
      })
  
  
      return NextResponse.json(article);
    } catch (error) {
      console.log('[ARTICLE_GET]', error)
      return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
  req: Request,
  { params } : { params: { articleId: string } }
) {
  try {
    const { userId }: { userId: string | null } = await auth();
    const body = await req.json()

    if(!userId){
      return new NextResponse("Unauthorized", { status : 401 });
    }

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

    if(!params.articleId) {
      return new NextResponse("Article id is requierd", { status : 400 });
    }

    const user = await currentUser();
    const userdb = await prismadb.user.findUnique({
      where: {
        email: user?.primaryEmailAddress?.emailAddress || "",
      },
    });
    const authorId = userdb?.id;

    const articleByUserId = await prismadb.article.findFirst({
      where:{
        id: params.articleId,
        authorId
      }
    })

    if(!articleByUserId){
        return new NextResponse("Unauthorized", {status: 403})
    }

    const article = await prismadb.article.updateMany({
      where:{
        id: params.articleId,
      },
      data:{
        title,
        description,
        authors,
        category,
        downloadUrl,
      }
    })

    return NextResponse.json(article);
  } catch (error) {
    console.log('[ARTICLE_PATCH]', error)
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE (
  _req: Request,
  { params } : { params: { articleId: string } }
) {
  try {
    const { userId } : {userId : string | null} = await auth()

    if(!userId){
      return new NextResponse("Unauthorized", { status : 401 });
    }

    if(!params.articleId) {
      return new NextResponse("Article id is requierd", { status : 400 });
    }

    const user = await currentUser();
    const userdb = await prismadb.user.findUnique({
      where: {
        email: user?.primaryEmailAddress?.emailAddress || "",
      },
    });
    const authorId = userdb?.id;

    const articleByUserId = await prismadb.article.findFirst({
      where:{
        id: params.articleId,
        authorId
      }
    })

    if(!articleByUserId){
        return new NextResponse("Unauthorized", {status: 403})
    }

    const article = await prismadb.article.deleteMany({
      where: {
        id: params.articleId,
      }
    })

    return NextResponse.json(article);
  } catch (error) {
    console.log('[ARTICLE_DELETE]', error)
    return new NextResponse("Internal error", { status: 500 });
  }
}