"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table"

import { EntryColumn, columns } from "./columns"

interface EntriesClientProps {
  data : EntryColumn[]
}

export const EntryClient : React.FC<EntriesClientProps> = ({
  data
}) =>{
  return (
    <>
      <div className="flex items-center justify-between">
          <Heading
            title={`Entries (${data.length})`}
            description="Edit your entries."
          />
      </div>
      <Separator />
      <DataTable searchKey="content" columns={columns} data={data}/>
    </>
  );
}