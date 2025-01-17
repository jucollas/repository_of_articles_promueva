"use client";

import { SignIn } from '@clerk/nextjs';
import logoPromueva from '@/public/LogoPromueva.png';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Image className="w-60 h-60 object-cover mb-6" src={logoPromueva} alt="logo promueva"/>
      <SignIn/>
    </div>
  )
}