import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import iconoPromueva from "@/public/IconoPromueva.png";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Image className="w-12 h-12 object-cover mb-6" src={iconoPromueva} alt="icono promueva"/>
        <MainNav className="mx-6"/>
        <div className="ml-auto flex items-center space-x-4">
          <UserButton/>
        </div>
      </div>      
    </div>
  );
}

export default Navbar;