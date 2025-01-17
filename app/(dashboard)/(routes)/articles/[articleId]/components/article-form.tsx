"use client";

import * as z from "zod"
import axios from "axios";
import { useState } from "react";
import { Article } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";


import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { AlertModal } from "@/components/modals/alert-modal";

const formSchema = z.object({
  title: z.string().min(1), // Campo obligatorio
  description: z.string().min(1),
  authors: z.string().min(1), // Lista de autores con al menos un elemento
  category: z.string().min(1), // Campo obligatorio
  downloadUrl: z.string().min(1), // Campo obligatorio
});

type ArticleFormValues = z.infer<typeof formSchema>;

interface ArticleFormProps {
  initialData: Article | null;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router =  useRouter();

  const categories = [
    {name: 'Polarization'},
    {name: 'Data'}, 
    {name: 'Evolution of opinion'}
  ]

  const title = initialData ? "Edit article" : "Create article";
  const description = initialData ? "Edit a article" : "Add a new article";
  const toastMessage = initialData ? "Article update." : "Article create.";
  const action = initialData ? "Save changes" : "Create";


  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      authors: '',
      category: '',
      downloadUrl: '',
      description: '',
    }
  });

  const onSubmit = async (data: ArticleFormValues) => {
    try {
      setLoading(true)
      if (initialData){
        await axios.patch(`/api/articles/${params.articleId}`, data);
      }else{
        await axios.post(`/api/articles`, data);
      }
      router.push(`/articles`)
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
      console.log(params.articleId)
      await axios.delete(`/api/articles/${params.articleId}`);
      router.push(`/articles`)
      toast.success("Article deleted.")
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong while deleting the article.");
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
              name="title"
              render={({ field }) => {
                return(
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Article title" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField 
              control={form.control}
              name="downloadUrl"
              render={({ field }) => {
                return(
                  <FormItem>
                    <FormLabel>Download url</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Article download url" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField 
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.name}
                          value={category.name}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authors"
              render={({ field }) => {
                return(
                  <FormItem>
                    <FormLabel>Authors</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Article authors" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField 
              control={form.control}
              name="description"
              render={({ field }) => {
                return(
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea disabled={loading} placeholder="Article description" {...field} />
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