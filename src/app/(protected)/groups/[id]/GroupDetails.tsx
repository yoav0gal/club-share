"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import {
  deleteGroupAction,
  updateGroupAction,
  type MutationActionState,
} from "../actions";
import type { Group } from "@/lib/db/schemas/club-share";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/toast";
import { GroupHeader } from "@/components/group-details/group-header";
import { GroupInfo } from "@/components/group-details/group-info";

type GroupWithMembersAndOwners = Group & {
  members: Array<{ email: string }>;
  owners: Array<{ email: string }>;
};

type GroupDetailsProps = {
  group: GroupWithMembersAndOwners;
};

export function GroupDetails({ group }: GroupDetailsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [editedName, setEditedName] = useState(group.name);
  const [editedOwnerEmails, setEditedOwnerEmails] = useState<string[]>([]);
  const [editedMemberEmails, setEditedMemberEmails] = useState<string[]>([]);

  // Initialize owner and member emails from the group
  useEffect(() => {
    setEditedOwnerEmails(group.owners.map((owner) => owner.email));
    setEditedMemberEmails(group.members.map((member) => member.email));
  }, [group]);

  const [deleteState, deleteFormAction] = useActionState<
    MutationActionState,
    FormData
  >(deleteGroupAction, { status: "idle" });

  const [updateState, updateFormAction, isUpdatePending] = useActionState<
    MutationActionState,
    FormData
  >(updateGroupAction, { status: "idle" });

  const handleDelete = () => {
    setIsDeletePending(true);
    const formData = new FormData();
    formData.append("groupId", group.id);
    deleteFormAction(formData);
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedName(group.name);
      setEditedMemberEmails(group.members.map((member) => member.email));
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setEditedName(group.name);
    setEditedMemberEmails(group.members.map((member) => member.email));
    setIsEditing(false);
  };

  const handleSaveEdit = (formData: FormData) => {
    // Ensure we have at least one owner
    if (editedOwnerEmails.length === 0) {
      toast({
        type: "error",
        description: "At least one owner is required.",
      });
      return;
    }

    formData.append("groupId", group.id);
    formData.append("name", editedName);

    // Clear any existing values that might be in the formData
    formData.delete("ownerEmails");
    formData.delete("memberEmails");

    // Add all owner emails
    editedOwnerEmails.forEach((email) => {
      formData.append("ownerEmails", email);
    });

    // Add all member emails
    editedMemberEmails.forEach((email) => {
      formData.append("memberEmails", email);
    });

    updateFormAction(formData);
  };

  if (deleteState.status === "success") {
    toast({
      type: "success",
      description: deleteState.message || "Group deleted successfully!",
    });
    router.push("/groups");
    return null;
  }

  if (updateState.status === "success") {
    toast({
      type: "success",
      description: updateState.message || "Group updated successfully!",
    });
    setIsEditing(false);
    // We would ideally refresh the group data here, but for now we'll just update the local state
    router.refresh();
  } else if (
    updateState.status === "failed" ||
    updateState.status === "invalid_data" ||
    updateState.status === "unauthorized"
  ) {
    toast({
      type: "error",
      description: updateState.message || "Failed to update group.",
    });
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Back</span>
      </Button>
      <Card>
        <CardHeader>
          <GroupHeader
            isEditing={isEditing}
            isUpdatePending={isUpdatePending}
            isDeletePending={isDeletePending}
            onEditToggle={handleEditToggle}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDelete}
            group={{
              id: group.id,
              name: group.name,
            }}
          />
        </CardHeader>
        <CardContent className="pt-6">
          <GroupInfo
            group={group}
            isEditing={isEditing}
            editedName={editedName}
            editedOwnerEmails={editedOwnerEmails}
            editedMemberEmails={editedMemberEmails}
            onNameChange={setEditedName}
            onOwnerEmailsChange={setEditedOwnerEmails}
            onMemberEmailsChange={setEditedMemberEmails}
          />
        </CardContent>
      </Card>
    </div>
  );
}
