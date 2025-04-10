"use client";

import { Article } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

interface ArticleEntry {
  id: string;
  content: string;
  createdAt: Date;
  author : {
    name: string,
    email: string
  }
}

interface ArticleViewProps {
  data: (Article & { entries?: ArticleEntry[] }) | null;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()
  const { user } = useUser()

  if (!data) {
    return <p className="text-center text-gray-500">No article data available.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{data.title}</h1>

      <div className="mb-4">
        <p className="text-gray-600">Authors: <span className="font-medium">{data.authors}</span></p>
        <p className="text-gray-600">Category: <span className="font-medium">{data.category}</span></p>
        <p className="text-gray-600">Created At: <span className="font-medium">{new Date(data.createdAt).toLocaleDateString()}</span></p>
        <p className="text-gray-600">Link: <span className="font-medium">{data.downloadUrl}</span></p>
      </div>

      <p className="text-gray-700 mb-6">{data.description}</p>

      <div className="flex flex-row gap-4">
        <Button asChild>
          <a href={data.downloadUrl} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" />
            Download Article
          </a>
        </Button>

        <Button onClick={() => router.push(`/articles/${params.articleId}/entries/new`)}>
          <Plus className="mr-2 h-4 w-4"/>
          Add New Entry
        </Button>
      </div>

      {data.entries && data.entries.length > 0 && (
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Entries</h2>
        <ul className="space-y-4">
          {data.entries.map((entry) => (
            <li key={entry.id} className="flex items-center p-4 border border-gray-200 rounded-md">
              {/* Botón para editar */}

              <div className="flex-1">
                <h3 className="font-medium text-gray-800 flex items-center">
                  {entry.author.name}
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </h3>
                <p className="text-gray-600">{entry.content}</p>
              </div>
              <Button disabled={entry.author.email == user?.primaryEmailAddress?.emailAddress} onClick={() => router.push(`/articles/${params.articleId}/entries/${entry.id}`)}>
                Edit
              </Button>

            </li>
          ))}
         </ul>
      </div>)}
    </div>
  );
};
