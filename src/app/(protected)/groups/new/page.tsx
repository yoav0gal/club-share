"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { GroupForm } from "@/components/group-form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { newGroupAction, type MutationActionState } from "../actions";

export default function AddGroupPage() {
  const router = useRouter();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});

  const [state, formAction] = useActionState<MutationActionState, FormData>(
    newGroupAction,
    {
      status: "idle",
    }
  );

  useEffect(() => {
    if (state.status === "failed") {
      toast({
        type: "error",
        description: state.message || "Failed to add group!",
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
        description: state.message || "Group added successfully!",
      });
      setIsSuccessful(true);
      router.push("/groups");
    }
  }, [state, router]);

  return (
    <div className="flex flex-col items-center justify-start pt-12 md:pt-16 px-4 w-full">
      <div className="w-full max-w-lg">
        <GroupForm
          action={formAction}
          defaultValues={defaultValues}
          // fieldErrors={state.fieldErrors}
          title="Add New Group"
        >
          <SubmitButton isSuccessful={isSuccessful}>Add Group</SubmitButton>
        </GroupForm>
      </div>
    </div>
  );
}
