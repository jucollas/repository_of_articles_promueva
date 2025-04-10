import { ObjectId } from "bson"
import prismadb from "@/lib/prismadb"
import { EntryForm } from "./components/entry-form";
import { redirect } from "next/navigation";
import { Entry, Tag } from "@prisma/client";

interface EntryWithTags extends Entry {
  tags: Tag[]; // Asegura que `tags` sea parte del tipo
}

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

  const entry = isValidEntries
  ? await prismadb.entry.findUnique({
      where: {
        id: params.entriesId,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })
  : null;

  const formattedEntry: EntryWithTags | null = entry
    ? {
        ...entry,
        tags: entry.tags.map(t => ({
          id: t.tag.id,
          name: t.tag.name,
        })),
      }
    : null;


  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EntryForm initialData={formattedEntry}/>
      </div>
    </div>
  );
}

export default EntriesPage;