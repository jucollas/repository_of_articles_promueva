"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table"

import { ArticleColumn, columns } from "./columns"

interface ArticleClientProps {
  data : ArticleColumn[]
}

export const ArticleClient : React.FC<ArticleClientProps> = ({
  data
}) =>{
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
          <Heading
            title={`Articles (${data.length})`}
            description="Create and edit your articles."
          />
          <Button onClick={() => router.push(`/articles/new`)}>
            <Plus className="mr-2 h-4 w-4"/>
            Add New
          </Button>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={data}/>
    </>
  );
}