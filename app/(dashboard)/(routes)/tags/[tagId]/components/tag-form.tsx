"use client";

import * as z from "zod"
import axios from "axios";
import { useState } from "react";
import { Tag } from "@prisma/client";
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
import { Checkbox } from "@/components/ui/checkbox";


const formSchema = z.object({
  name: z.string().min(1),
});

type TagFormValues = z.infer<typeof formSchema>;

interface TagFormProps {
  initialData: Tag | null;
}

export const TagForm: React.FC<TagFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router =  useRouter();

  const title = initialData ? "Edit tag" : "Create tag";
  const description = initialData ? "Edit a tag" : "Add a new tag";
  const toastMessage = initialData ? "tag update." : "tag create.";
  const action = initialData ? "Save changes" : "Create";


  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<TagFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
    }
  });

  const onSubmit = async (data: TagFormValues) => {
    try {
      setLoading(true)
      if (initialData){
        await axios.patch(`/api/tags/${params.tagId}/`, data);
      }else{
        await axios.post(`/api/tags`, data);
      }
      router.push(`/tags`)
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
      await axios.delete(`/api/tags/${params.tagId}`);
      router.push(`/tags`)
      toast.success("Tag deleted.")
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong while deleting the tag.");
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
              name="name"
              render={({ field }) => {
                return(
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Textarea disabled={loading} placeholder="Tag name" {...field} />
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