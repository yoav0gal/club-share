import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Pencil, Save, X } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { DeleteContactDialog } from "./delete-contact-dialog";

interface ContactHeaderProps {
  isEditing: boolean;
  isUpdatePending: boolean;
  isDeletePending: boolean;
  onEditToggle: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (formData: FormData) => void;
  onDelete: () => void;
  contact: { contactEmail: string; displayName?: string };
}

export function ContactHeader({
  isEditing,
  isUpdatePending,
  isDeletePending,
  onEditToggle,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  contact,
}: ContactHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle>Contact Details</CardTitle>
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <form action={onSaveEdit} className="flex items-center space-x-2">
            <SubmitButton isSuccessful={isUpdatePending}>
              <Save className="h-4 w-4" />
            </SubmitButton>
            <Button
              variant="outline"
              size="icon"
              onClick={onCancelEdit}
              title="Cancel Edit"
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <Button
            variant="outline"
            size="icon"
            onClick={onEditToggle}
            title="Edit Contact"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {!isEditing && (
          <DeleteContactDialog
            contact={contact}
            onDelete={onDelete}
            isDeletePending={isDeletePending}
          />
        )}
      </div>
    </div>
  );
}
