"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { ContactForm } from "@/components/contact-form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { newContact, type MutationActionState } from "../actions";

export default function AddContactPage() {
  const router = useRouter();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});

  const [state, formAction] = useActionState<MutationActionState, FormData>(
    newContact,
    {
      status: "idle",
    }
  );

  useEffect(() => {
    if (state.status === "failed") {
      toast({
        type: "error",
        description: state.message || "Failed to add contact!",
      });
      setIsSuccessful(false);
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: state.message || "Failed validating your submission!",
      });
      setIsSuccessful(false);
    } else if (state.status === "success") {
      toast({
        type: "success",
        description: state.message || "Contact added successfully!",
      });
      setIsSuccessful(true);
      router.push("/contacts");
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    formAction(formData);
  };

  return (
    <div className="flex flex-col items-center justify-start pt-12 md:pt-16 px-4 w-full">
      <div className="w-full max-w-lg">
        <ContactForm
          action={handleSubmit}
          defaultValues={defaultValues}
          //   fieldErrors={state.fieldErrors}
          title="Add New Contact"
        >
          <SubmitButton isSuccessful={isSuccessful}>Add Contact</SubmitButton>
        </ContactForm>
      </div>
    </div>
  );
}
