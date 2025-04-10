"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table"

import { TagColumn, columns } from "./columns"

interface TagClientProps {
  data : TagColumn[]
}

export const TagClient : React.FC<TagClientProps> = ({
  data
}) =>{
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
          <Heading
            title={`Tags (${data.length})`}
            description="Create and edit your Tags."
          />
          <Button onClick={() => router.push(`/tags/new`)}>
            <Plus className="mr-2 h-4 w-4"/>
            Add New
          </Button>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={data}/>
    </>
  );
}