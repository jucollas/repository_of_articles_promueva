import { ObjectId } from "bson"
import prismadb from "@/lib/prismadb"
import { ArticleForm } from "./components/article-form";

const AriclesPage = async ({
  params
} : {
  params : { articleId: string }
}) => {
  const isValid = ObjectId.isValid(params.articleId);
  const article = isValid ? await prismadb.article.findUnique({
    where:{
      id: params.articleId
    }
  }) : null;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ArticleForm initialData={article}/>
      </div>
    </div>
  );
}

export default AriclesPage;