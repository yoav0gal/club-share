'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import Form from 'next/form';

interface GroupData {
  name?: string;
}

interface FieldErrors {
  name?: string;
  memberEmails?: string;
}

export function GroupForm({
  action,
  children,
  defaultValues = {},
  className,
  fieldErrors,
  title = 'Group Details',
  ...props
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultValues?: GroupData;
  className?: string;
  fieldErrors?: FieldErrors;
  title?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberEmails = searchParams.getAll('memberEmails');

  const handleFormSubmit = (formData: FormData) => {
    memberEmails.forEach((email) => {
      formData.append('memberEmails', email);
    });
    if (typeof action === 'function') {
      action(formData);
    } else {
      console.warn('Form action is not a function.');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push('/groups/new/select-contacts')}
        className="mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Back</span>
      </Button>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form action={handleFormSubmit} className="flex flex-col gap-4">
            <div className="grid gap-6">
              {/* Group Name Input */}
              <div className="grid gap-2">
                <Input
                  id="name"
                  name="name"
                  className="text-lg font-medium text-center bg-transparent border-none shadow-none focus-visible:ring-0"
                  type="text"
                  placeholder="Enter Group Name"
                  defaultValue={defaultValues.name}
                  required
                />
                {fieldErrors?.name && (
                  <p className="text-sm text-red-500 mt-1 text-center">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Selected Members Grid */}
              <div className="grid gap-4">
                <div className="text-sm text-muted-foreground text-center">
                  {memberEmails.length} members selected
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                  {memberEmails.map((email) => (
                    <div
                      key={email}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-medium"
                        title={email}
                      >
                        {email[0].toUpperCase()}
                      </div>
                      <span
                        className="text-xs text-center truncate w-full"
                        title={email}
                      >
                        {email.split('@')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button Area */}
              {children}
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
