import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Form from 'next/form';
import { signInWithProvider } from '@/app/(auth)/actions';
import { PolicysFooter } from './policys-footer';

interface FieldErrors {
  email?: string;
  password?: string;
  name?: string;
}

export function RegisterForm({
  action,
  children,
  defaultEmail = '',
  defaultName = '',
  className,
  fieldErrors,
  ...props
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
  defaultName?: string;
  className?: string;
  fieldErrors?: FieldErrors;
}) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form action={action} className="flex flex-col gap-4">
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    await signInWithProvider('google');
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Register with Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label
                    htmlFor="name"
                    className="text-zinc-600 font-normal dark:text-zinc-400"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    className="bg-muted text-md md:text-sm"
                    type="text"
                    placeholder="Peter Griffin"
                    defaultValue={defaultName}
                    required
                  />
                  {fieldErrors?.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-zinc-600 font-normal dark:text-zinc-400"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    className="bg-muted text-md md:text-sm"
                    type="email"
                    placeholder="peterGriffin@gmail.com"
                    autoComplete="email"
                    required
                    autoFocus
                    defaultValue={defaultEmail}
                  />
                  {fieldErrors?.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label
                      htmlFor="password"
                      className="text-zinc-600 font-normal dark:text-zinc-400"
                    >
                      Password
                    </Label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    className="bg-muted text-md md:text-sm"
                    type="password"
                    required
                  />
                  {fieldErrors?.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>
                {children}
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
      <PolicysFooter />
    </div>
  );
}
