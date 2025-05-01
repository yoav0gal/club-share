"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { deleteGroupAction, type MutationActionState } from "../actions";
import type { Group } from "@/lib/db/schemas/club-share";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/components/toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";

type GroupWithMembers = Group & {
  members: Array<{ email: string }>;
};

type GroupDetailsProps = {
  group: GroupWithMembers;
};

export function GroupDetails({ group }: GroupDetailsProps) {
  const router = useRouter();
  const [isDeletePending, setIsDeletePending] = useState(false);

  const [deleteState, deleteFormAction] = useActionState<
    MutationActionState,
    FormData
  >(deleteGroupAction, { status: "idle" });

  const handleDelete = () => {
    setIsDeletePending(true);
    const formData = new FormData();
    formData.append("groupId", group.id);
    deleteFormAction(formData);
  };

  if (deleteState.status === "success") {
    toast({
      type: "success",
      description: deleteState.message || "Group deleted successfully!",
    });
    router.push("/groups");
    return null;
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Link href="/groups">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <div className="flex gap-2">
            <Link href={`/groups/${group.id}/edit`}>
              <Button variant="outline" size="icon" title="Edit Group">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <GroupDeleteButton
              group={group}
              handleDelete={handleDelete}
              isDeletePending={isDeletePending}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="text-sm text-muted-foreground">
              {group.members.length} members
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
              {group.members.map((member) => (
                <div
                  key={member.email}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-medium"
                    title={member.email}
                  >
                    {member.email[0].toUpperCase()}
                  </div>
                  <span
                    className="text-xs text-center truncate w-full"
                    title={member.email}
                  >
                    {member.email.split("@")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GroupDeleteButton({
  group,
  handleDelete,
  isDeletePending,
}: {
  group: Group;
  handleDelete: () => void;
  isDeletePending: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" title="Delete Group">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the group
            '{group.name}'.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>
          <form action={handleDelete} className="w-full sm:w-auto">
            <input type="hidden" name="groupId" value={group.id} />
            <SubmitButton
              isSuccessful={isDeletePending}
              className="w-full sm:w-auto"
            >
              Delete
            </SubmitButton>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
