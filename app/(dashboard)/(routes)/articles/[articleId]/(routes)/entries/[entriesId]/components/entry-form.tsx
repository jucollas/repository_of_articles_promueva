"use client";

import * as z from "zod"
import axios from "axios";
import { useState } from "react";
import { Entry } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";


import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormField, 
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AlertModal } from "@/components/modals/alert-modal";

const formSchema = z.object({
  content: z.string().min(1),
});

type EntryFormValues = z.infer<typeof formSchema>;

interface EntryFormProps {
  initialData: Entry | null;
}

export const EntryForm: React.FC<EntryFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router =  useRouter();

  const title = initialData ? "Edit entry" : "Create entry";
  const description = initialData ? "Edit a entry" : "Add a new entry";
  const toastMessage = initialData ? "Entry update." : "Entry create.";
  const action = initialData ? "Save changes" : "Create";


  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      content: '',
    }
  });

  const onSubmit = async (data: EntryFormValues) => {
    try {
      setLoading(true)
      if (initialData){
        await axios.patch(`/api/articles/${params.articleId}/entries/${params.entriesId}`, data);
      }else{
        await axios.post(`/api/articles/${params.articleId}/entries/`, data);
      }
      router.push(`/articles/${params.articleId}/view`)
      toast.success(toastMessage)
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/articles/${params.articleId}/entries/${params.entriesId}`);
      router.push(`/articles/${params.articleId}/view`)
      toast.success("Entry deleted.")
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong while deleting the entry.");
    } finally {
      setLoading(false)
      setOpen(false)
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description} 
        />
        { initialData && (
          <Button
            disabled={loading}
            variant= "destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4"/>
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name="content"
              render={({ field }) => {
                return(
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea disabled={loading} placeholder="Entry content" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}