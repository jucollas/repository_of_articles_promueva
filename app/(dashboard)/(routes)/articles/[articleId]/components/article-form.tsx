"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Article } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { ArticleInput } from "./article-input";

const formSchema = z.object({
  ieeeUrl: z.string().min(1),
});

type ArticleFetchValues = z.infer<typeof formSchema>;

interface ArticleFormProps {
  initialData: Article | null;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit article" : "Create article";
  const description = initialData ? "Edit an article" : "Add a new article";
  const toastMessage = "Fetch Data";
  const action = "Fetch Info";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [articleData, setArticleData] = useState<Article | null>(initialData);

  const form = useForm<ArticleFetchValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ieeeUrl: "",
    },
  });

  const onFetch = async (data: ArticleFetchValues) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/ieee/`, data);
      setArticleData(response.data);
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
      await axios.delete(`/api/articles/${params.articleId}`);
      router.push(`/articles`);
      toast.success("Article deleted.");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong while deleting the article.");
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
        <form onSubmit={form.handleSubmit(onFetch)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="ieeeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IEEE URL</FormLabel>
                  <FormControl>
                    <Input disabled={loading || !!initialData} placeholder="Article IEEE URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading || !!initialData} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <ArticleInput initialData={articleData} />
    </>
  );
};
