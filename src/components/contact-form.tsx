import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Form from "next/form";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ContactData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export function ContactForm({
  action,
  children,
  defaultValues = {},
  className,
  fieldErrors,
  title = "Contact Details",
  ...props
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultValues?: ContactData;
  className?: string;
  fieldErrors?: FieldErrors;
  title?: string;
}) {
  const router = useRouter();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Back</span>
      </Button>
      <Card>
        <CardHeader className="text-center ">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form action={action} className="flex flex-col gap-4">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="firstName"
                    className="text-zinc-600 font-normal dark:text-zinc-400"
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    className="bg-muted text-md md:text-sm"
                    type="text"
                    placeholder="John"
                    defaultValue={defaultValues.firstName}
                    required
                  />
                  {fieldErrors?.firstName && (
                    <p className="text-sm text-red-500 mt-1">
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="lastName"
                    className="text-zinc-600 font-normal dark:text-zinc-400"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    className="bg-muted text-md md:text-sm"
                    type="text"
                    placeholder="Doe"
                    defaultValue={defaultValues.lastName}
                    required
                  />
                  {fieldErrors?.lastName && (
                    <p className="text-sm text-red-500 mt-1">
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
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
                  name="contactEmail"
                  className="bg-muted text-md md:text-sm"
                  type="email"
                  placeholder="john.doe@example.com"
                  autoComplete="email"
                  defaultValue={defaultValues.email}
                  required
                />
                {fieldErrors?.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>
              {children}
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
