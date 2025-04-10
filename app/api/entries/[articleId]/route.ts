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

    // Buscar artículo por ID con await
    const articleBy = await prismadb.article.findUnique({
      where: {
        id: params.articleId,
      }
    });

    if (!articleBy) {
      return new NextResponse("Article not found", { status: 400 });
    }

    const body = await req.json();
    const { content, archived, tags } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
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

    // Crear entry y conectar tags existentes
    const entry = await prismadb.entry.create({
      data: {
        content,
        archived,
        author: { connect: { id: user.id } },
        article: { connect: { id: params.articleId } },
        tags: {
          create: tags.map((tagId: string) => ({
            tag: {
              connect: { id: tagId },
            }
          }))
        }
      },
      include: {
        tags: {
          include: { tag: true },
        },
      },
    });

    return NextResponse.json(entry);

  } catch (error) {
    console.error("[ENTRY_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}