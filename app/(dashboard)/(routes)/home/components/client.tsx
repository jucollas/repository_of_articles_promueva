"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table"

import logoPromueva from '@/public/LogoPromueva.png';

import { ArticleColumn, columns } from "./columns"
import { useUser } from "@clerk/nextjs";

interface HomeClientProps {
  data : ArticleColumn[]
}

export const HomeClient : React.FC<HomeClientProps> = ({
  data
}) =>{
  const router = useRouter();
  const { user } = useUser()

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight">
        Welcome {user?.firstName}
      </h2>
      <div className="flex flex-col items-center justify-center">
        <Image className="w-60 h-60 object-cover mb-6" src={logoPromueva} alt="logo promueva"/>

      </div>
      <Heading
        title={`All articles (${data.length})`}
        description="Find the articles that interest you."
      />

      <Separator />
      <DataTable searchKey="title" columns={columns} data={data}/>
    </>
  );
}