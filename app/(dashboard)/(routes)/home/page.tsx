import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { HomeClient } from "./components/client";
import { ArticleColumn } from "./components/columns";


const HomePage = async () => {
  const articles = await prismadb.article.findMany({
    include:{
      author: true
    }
  });

  const formatedArticles : ArticleColumn[] = articles.map((item) => ({
    id: item.id,
    title: item.title,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
    category: item.category,
    firstReviewer: item.author.name
  }))

  return(
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HomeClient data={formatedArticles} />
      </div>
    </div>
  );
}

export default HomePage;