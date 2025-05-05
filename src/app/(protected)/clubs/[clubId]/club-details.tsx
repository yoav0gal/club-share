'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { deleteClubAction, type MutationActionState } from '../actions';
import type { ClubDetailsWithOwnership } from '@/lib/db/queries/clubs'; // Use the correct type
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { toast } from '@/components/toast';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SubmitButton } from '@/components/submit-button';
import Link from 'next/link';
import Form from 'next/form';

// Define the props for the ClubDeleteButton component
interface ClubDeleteButtonProps {
  clubId: string;
  isOwner: boolean;
  handleDelete: () => void;
  isDeletePending: boolean;
}

// Separate component for the delete button and dialog
function ClubDeleteButton({
  clubId,
  isOwner,
  handleDelete,
  isDeletePending,
}: ClubDeleteButtonProps) {
  if (!isOwner) {
    return null; // Don't show delete button if not owner
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" title="Delete Club">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the club.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* Use a form for the delete action */}
          <Form action={handleDelete} className="inline-flex">
            <input type="hidden" name="clubId" value={clubId} />
            <SubmitButton isSuccessful={isDeletePending}>
              {isDeletePending ? 'Deleting...' : 'Delete'}
            </SubmitButton>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Define the props for the ClubDetails component
type ClubDetailsProps = {
  clubDetails: ClubDetailsWithOwnership;
};

export function ClubDetails({ clubDetails }: ClubDetailsProps) {
  const router = useRouter();
  const { club, ownerEmail, isOwner } = clubDetails;
  const [isDeletePending, setIsDeletePending] = useState(false);

  const [deleteState, deleteFormAction] = useActionState<
    MutationActionState,
    FormData
  >(deleteClubAction, { status: 'idle' });

  const handleDelete = () => {
    setIsDeletePending(true);
    // The form inside ClubDeleteButton will handle submitting the FormData
    // We just need to trigger the action state hook here
    const formData = new FormData();
    formData.append('clubId', club.id);
    deleteFormAction(formData);
  };

  // Handle successful deletion
  if (deleteState.status === 'success') {
    toast({
      type: 'success',
      description: deleteState.message || 'Club deleted successfully!',
    });
    // Redirect to the clubs list page after successful deletion
    router.push('/clubs');
    return null; // Prevent rendering the rest of the component after redirect
  }

  // Handle deletion failure
  if (
    deleteState.status === 'failed' ||
    deleteState.status === 'unauthorized' ||
    deleteState.status === 'invalid_data'
  ) {
    toast({
      type: 'error',
      description: deleteState.message || 'Failed to delete club.',
    });
    // Reset pending state on failure
    if (isDeletePending) {
      setIsDeletePending(false);
    }
    // Optionally reset the action state if needed, though useActionState might handle this
    // deleteState.status = 'idle'; // Be careful with direct state mutation if not intended
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Link href="/clubs">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to Clubs</span>
        </Button>
      </Link>
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h1 className="text-2xl font-bold">{club.name}</h1>
          <div className="flex gap-2">
            {isOwner && (
              <Link href={`/clubs/${club.id}/edit`}>
                {' '}
                {/* Placeholder for edit link */}
                <Button variant="outline" size="icon" title="Edit Club">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <ClubDeleteButton
              clubId={club.id}
              isOwner={isOwner}
              handleDelete={handleDelete} // Pass the handler
              isDeletePending={isDeletePending}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="text-sm">
              <span className="font-semibold">Owner:</span> {ownerEmail}
            </div>
            <div className="text-sm text-muted-foreground">
              Created: {new Date(club.createdAt).toLocaleDateString()}
            </div>
            {/* Display other club details from club.details object */}
            {club.details && Object.keys(club.details).length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {Object.entries(club.details).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <dt className="font-medium capitalize text-muted-foreground">
                        {key.replace(/_/g, ' ')}
                      </dt>
                      <dd>{String(value)}</dd> {/* Ensure value is string */}
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {/* Add more sections as needed, e.g., for members if fetched */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
