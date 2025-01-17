import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { ArticleClient } from "./components/client";
import { currentUser } from "@clerk/nextjs/server";
import { ArticleColumn } from "./components/columns";


const ArticlesPage = async () => {
  const userInfo = await currentUser()
  const email = userInfo?.primaryEmailAddress?.emailAddress
  const user = await prismadb.user.findUnique({
    where:{
      email
    },
    include:{
      articles: true
    }
  })

  const articles = user?.articles || [];

  const formatedArticles : ArticleColumn[] = articles.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
    category: item.category
  }))

  return(
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ArticleClient data={formatedArticles} />
      </div>
    </div>
  );
}

export default ArticlesPage;