"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

export type EntryColumn = {
  id: string;
  content: string;
  createdAt: string;
  articleId: string,
  articleTitle: string,
}

export const columns: ColumnDef<EntryColumn>[] = [
  {
    accessorKey: "content",
    header: "content",
  },
  {
    accessorKey: "articleTitle",
    header: "Article Title",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]