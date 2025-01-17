import { ObjectId } from "bson"
import prismadb from "@/lib/prismadb"
import { EntryForm } from "./components/entry-form";
import { redirect } from "next/navigation";

const EntriesPage = async ({
  params
} : {
  params : { articleId: string, entriesId: string }
}) => {
  const isValidArticle = ObjectId.isValid(params.articleId);
  const isValidEntries = ObjectId.isValid(params.entriesId);

  const article = isValidArticle ? await prismadb.article.findUnique({
    where: {
      id: params.articleId,
    }
  }) : null;

  if(!article){
    redirect('/home');
  }

  const entry = isValidEntries ? await prismadb.entry.findUnique({
    where: {
      id: params.entriesId,
    }
  }) : null;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EntryForm initialData={entry}/>
      </div>
    </div>
  );
}

export default EntriesPage;