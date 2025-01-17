import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

import  Navbar  from '@/components/navbar';

export default  async function DashboardLayout({
  children
} : {
  children : React.ReactNode
}) {
  const { userId } : {userId: string | null } =  await auth();
  //const user = await currentUser();
  
  if(!userId){
    redirect('/sign-in');
  }

  return (
    <div className="p-4">
      <Navbar />
      {children}
    </div>
  );
}