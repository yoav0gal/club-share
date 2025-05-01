import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
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
import { Trash2 } from "lucide-react";

interface GroupHeaderProps {
  isEditing: boolean;
  isUpdatePending: boolean;
  isDeletePending: boolean;
  onEditToggle: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (formData: FormData) => void;
  onDelete: () => void;
  group: { id: string; name: string };
}

export function GroupHeader({
  isEditing,
  isUpdatePending,
  isDeletePending,
  onEditToggle,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  group,
}: GroupHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <h1 className="text-2xl font-bold">{group.name}</h1>
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <form action={onSaveEdit} className="flex items-center space-x-2">
            <input type="hidden" name="groupId" value={group.id} />
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
            title="Edit Group"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {!isEditing && (
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
                  This action cannot be undone. This will permanently delete the
                  group '{group.name}'.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <AlertDialogCancel className="w-full sm:w-auto">
                  Cancel
                </AlertDialogCancel>
                <form action={onDelete} className="w-full sm:w-auto">
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
        )}
      </div>
    </div>
  );
}
