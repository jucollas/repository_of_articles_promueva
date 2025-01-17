import { redirect } from 'next/navigation';
import { ObjectId } from "bson"
import prismadb from "@/lib/prismadb"
import { ArticleView } from './components/article-view';

const AriclesViewPage = async ({
  params
} : {
  params : { articleId: string }
}) => {
  const isValid = ObjectId.isValid(params.articleId);
  const article = isValid ? await prismadb.article.findUnique({
    where:{
      id: params.articleId
    }, 
    include :{
      entries : {
        include:{
          author:{
            select:{
              name: true,
              email: true,
            }
          }
        }
      }
    }
  }) : null;

  if (!article){
    redirect("/articles");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ArticleView data={article}/>
      </div>
    </div>
  );
}

export default AriclesViewPage;