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
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import { Trash2 } from "lucide-react";

interface DeleteContactDialogProps {
  contact: { contactEmail: string; displayName?: string };
  onDelete: () => void;
  isDeletePending: boolean;
}

export function DeleteContactDialog({
  contact,
  onDelete,
  isDeletePending,
}: DeleteContactDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" title="Delete Contact">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            contact '{contact.displayName || contact.contactEmail}'.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>
          <form action={onDelete} className="w-full sm:w-auto">
            <input
              type="hidden"
              name="contactEmail"
              value={contact.contactEmail}
            />
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
