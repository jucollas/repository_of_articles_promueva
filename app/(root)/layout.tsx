import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import prismadb from '@/lib/prismadb';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Autenticación del usuario
  const { userId }: { userId: string | null } = await auth();

  // Redirigir si no hay usuario autenticado
  if (!userId) {
    redirect('/sign-in'); // Corregido el typo 'sing-in' a 'sign-in'
    return null; // Importante para evitar errores en ejecución
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  if (!email) {
    redirect('/sign-in'); // Redirige si el email no está disponible
    return null;
  }

  const userExist = await prismadb.user.findFirst({
    where: {
      email: email,
    },
  });

  if (userExist) {
    redirect('/home'); // Redirige si el usuario ya existe
    return null;
  }

  // Crear un nuevo usuario si no existe
  await prismadb.user.create({
    data: {
      email: email,
      name: user?.fullName ?? 'Default Name', // Nombre predeterminado si no hay nombre
    },
  });

  redirect('/home');
  return (
    <>
    {children}
    </>
  );
}
