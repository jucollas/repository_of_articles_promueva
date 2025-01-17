"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

export type ArticleColumn = {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  firstReviewer: string;
}

export const columns: ColumnDef<ArticleColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "firstReviewer",
    header: "Reviewer",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]