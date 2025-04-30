import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { ShieldCheck, Pencil, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const userName = session.user.name || session.user.email;

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.14))] flex-col items-center justify-center  p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="items-center text-center">
          <ShieldCheck className="h-12 w-12 text-emerald-500 mb-4" />
          <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
          <CardDescription>
            Welcome, {userName}! This is a protected area.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            You have successfully logged in and can view this page.
          </p>
          <div className="flex items-center justify-center rounded-md border border-dashed border-muted-foreground/50 p-4 bg-background/50">
            <Pencil className="h-5 w-5 mr-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Get started by editing{' '}
              <code className="font-mono bg-muted px-1 py-0.5 rounded">
                src/app/(protected)/dashboard/page.tsx
              </code>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
