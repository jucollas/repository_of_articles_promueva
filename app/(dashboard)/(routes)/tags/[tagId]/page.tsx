import { ObjectId } from "bson"
import prismadb from "@/lib/prismadb"
import { TagForm } from "./components/tag-form";

const AriclesPage = async ({
  params
} : {
  params : { tagId: string }
}) => {
  const isValid = ObjectId.isValid(params.tagId);
  const tag = isValid ? await prismadb.tag.findUnique({
    where:{
      id: params.tagId
    }
  }) : null;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TagForm initialData={tag}/>
      </div>
    </div>
  );
}

export default AriclesPage;