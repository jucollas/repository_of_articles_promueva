import { NextResponse } from "next/server";
import axios from "axios";
import { auth } from '@clerk/nextjs/server';



const IEEE_API_KEY = process.env.IEEE_API_KEY;

export async function POST(req: Request) {
  try {
    const { userId }: { userId: string | null } = await auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    const body = await req.json();
    const { ieeeUrl } = body;

    if (!ieeeUrl) {
      console.log("soy gay")
      return NextResponse.json({ error: "Se requiere el enlace de IEEE" }, { status: 400 });
    }

    // Extraer el número de artículo desde la URL de IEEE
    const articleMatch = ieeeUrl.match(/document\/(\d+)/);

    if (!articleMatch) {
      return NextResponse.json({ error: "URL no válida de IEEE" }, { status: 400 });
    }

    const articleNumber = articleMatch[1];

    // Hacer la solicitud a la API de IEEE
    const ieeeApiUrl = `https://ieeexploreapi.ieee.org/api/v1/search/articles?apikey=${IEEE_API_KEY}&article_number=${articleNumber}`;
    const { data } = await axios.get(ieeeApiUrl);

    if (!data || !data.articles || data.articles.length === 0) {
      return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 });
    }

    const article = data.articles[0];

    // Extraer los datos relevantes
    const art = {
      title: article.title || "Título no disponible",
      authors: article.authors?.map((a: any) => a.full_name).join(", ") || "Autores no disponibles",
      category: article.publication_title || "Sin categoría",
      description: article.abstract || "No disponible",
      downloadUrl: article.pdf_url || ieeeUrl,
    };

    return NextResponse.json(art, { status: 200 });
  } catch (error) {
    console.error("Error al obtener información de IEEE:", error);
    return NextResponse.json({ error: "Error al obtener los datos del artículo" }, { status: 500 });
  }
}
