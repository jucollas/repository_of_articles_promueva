"use client";

import axios from "axios";
import { 
  Copy, 
  Edit,
  Trash, 
  MoreHorizontal,
  View, 
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react"; 


import { 
  DropdownMenu, 
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";

import { ArticleColumn } from "./columns"

interface CellActionProps {
  data: ArticleColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
  data
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success("Article Id copied to the clipboard.")
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/articles/${data.id}`);
      toast.success("Article deleted.")
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong while deleting the article.");
    } finally {
      setLoading(false)
      setOpen(false)
    }
  };

  return(
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4"/>
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/articles/${data.id}/view`)}>
            <View className="mr-2 h-4 w-4"/>
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/articles/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4"/>
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4"/>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
    
  );
}