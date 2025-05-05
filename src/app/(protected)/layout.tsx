import type { ReactNode } from 'react';
import { auth } from '../(auth)/auth';
import { redirect } from 'next/navigation';
import { Layout } from '@/components/page-layout';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/clubs');
  }

  return <Layout>{children}</Layout>;
}
