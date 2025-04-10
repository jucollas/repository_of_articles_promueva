import prismadb from "@/lib/prismadb";
import { TagClient } from "./components/client";
import { TagColumn } from "./components/columns";


const EntriesPage = async () => {
  const tags = await prismadb.tag.findMany()

  const formatedEntrices : TagColumn[] = tags.map((item) => ({
    id: item.id,
    name: item.name,
  }))

  return(
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TagClient data={formatedEntrices} />
      </div>
    </div>
  );
}

export default EntriesPage;