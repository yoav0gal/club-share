"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  isSuccessful,
  className,
}: {
  children: React.ReactNode;
  isSuccessful: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? "button" : "submit"}
      aria-disabled={pending || isSuccessful}
      disabled={pending || isSuccessful}
      className={cn("relative", className)}
    >
      {children}

      {(pending || isSuccessful) && (
        <span className="animate-spin absolute right-4">
          <LoaderCircle />
        </span>
      )}

      <output aria-live="polite" className="sr-only">
        {pending || isSuccessful ? "Loading" : "Submit form"}
      </output>
    </Button>
  );
}
