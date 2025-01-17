import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { EntryClient } from "./components/client";
import { currentUser } from "@clerk/nextjs/server";
import { EntryColumn } from "./components/columns";


const EntriesPage = async () => {
  const userInfo = await currentUser()
  const email = userInfo?.primaryEmailAddress?.emailAddress
  const user = await prismadb.user.findUnique({
    where:{
      email
    },
    include:{
      entries: {
        include:{
          article:{
            select:{
              title: true,
            }
          }
        }
      }
    }
  })

  const entries = user?.entries || [];

  const formatedEntrices : EntryColumn[] = entries.map((item) => ({
    id: item.id,
    content: item.content,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
    articleId: item.articleId,
    articleTitle: item.article.title,
  }))

  return(
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EntryClient data={formatedEntrices} />
      </div>
    </div>
  );
}

export default EntriesPage;