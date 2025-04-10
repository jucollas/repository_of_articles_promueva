"use client";

import * as z from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { Entry, Tag } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import Select from "react-select";

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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  content: z.string().min(1),
  archived: z.boolean(),
  tags: z.array(z.string()).optional()
});

type EntryFormValues = z.infer<typeof formSchema>;

interface EntryWithTags extends Entry {
  tags: Tag[]; // Asegura que `tags` sea parte del tipo
}

interface EntryFormProps {
  initialData: EntryWithTags | null;
}

export const EntryForm: React.FC<EntryFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit entry" : "Create entry";
  const description = initialData ? "Edit an entry" : "Add a new entry";
  const toastMessage = initialData ? "Entry updated." : "Entry created.";
  const action = initialData ? "Save changes" : "Create";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);

  // Cargar etiquetas disponibles desde la API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("/api/tags");
        setTags(response.data.map((tag: { id: string; name: string }) => ({
          value: tag.id,
          label: tag.name
        })));
      } catch (error) {
        toast.error("Failed to load tags.");
      }
    };
    fetchTags();
  }, []);

  const form = useForm<EntryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialData?.content || "",
      archived: initialData?.archived || false,
      tags: initialData ? initialData.tags?.map(tag => tag.id) : []
    }
  });

  const onSubmit = async (data: EntryFormValues) => {
    try {
      setLoading(true);
      const payload = { 
        ...data, 
        tags: data.tags || [] 
      };

      if (initialData) {
        await axios.patch(`/api/entries/${params.articleId}/${params.entriesId}`, payload);
      } else {
        await axios.post(`/api/entries/${params.articleId}`, payload);
      }

      router.push(`/articles/${params.articleId}/view`);
      toast.success(toastMessage);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/entries/${params.articleId}/${params.entriesId}`);
      router.push(`/articles/${params.articleId}/view`);
      toast.success("Entry deleted.");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong while deleting the entry.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal isOpen={open} loading={loading} onClose={() => setOpen(false)} onConfirm={onDelete} />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea disabled={loading} placeholder="Entry content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="archived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Select
                      isMulti
                      options={tags}
                      isDisabled={loading}
                      value={tags.filter(tag => field.value?.includes(tag.value))}
                      onChange={(selected) => field.onChange(selected.map(tag => tag.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
