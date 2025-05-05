'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import {
  deleteContactAction,
  updateContactAction,
  type MutationActionState,
} from '../actions';
import type { Contact } from '@/lib/db/schemas/club-share';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/toast';
import { ContactHeader } from '@/components/contact-details/contact-header';
import { ContactInfo } from '@/components/contact-details/contact-info';

type ContactDetailsProps = {
  initialContact: Contact;
};

export function ContactDetails({ initialContact }: ContactDetailsProps) {
  const router = useRouter();
  const [contact, setContact] = useState<Contact>(initialContact);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState(
    contact.displayName || '',
  );

  const [deleteState, deleteFormAction, isDeletePending] = useActionState<
    MutationActionState,
    FormData
  >(deleteContactAction, { status: 'idle' });

  const [updateState, updateFormAction, isUpdatePending] = useActionState<
    MutationActionState,
    FormData
  >(updateContactAction, { status: 'idle' });

  const handleDelete = () => {
    const formData = new FormData();
    formData.append('contactEmail', contact.contactEmail);
    deleteFormAction(formData);
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedDisplayName(contact.displayName || '');
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setEditedDisplayName(contact.displayName || '');
    setIsEditing(false);
  };

  const handleSaveEdit = (formData: FormData) => {
    formData.append('contactEmail', contact.contactEmail);
    formData.append('displayName', editedDisplayName);
    updateFormAction(formData);
  };

  if (deleteState.status === 'success') {
    toast({
      type: 'success',
      description: deleteState.message || 'Contact deleted successfully!',
    });
    router.push('/contacts');
    return null;
  }

  if (updateState.status === 'success') {
    toast({
      type: 'success',
      description: updateState.message || 'Contact updated successfully!',
    });
    setIsEditing(false);
    setContact({
      ...contact,
      displayName: editedDisplayName,
    });
  } else if (
    updateState.status === 'failed' ||
    updateState.status === 'invalid_data'
  ) {
    toast({
      type: 'error',
      description: updateState.message || 'Failed to update contact.',
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
          <ContactHeader
            isEditing={isEditing}
            isUpdatePending={isUpdatePending}
            isDeletePending={isDeletePending}
            onEditToggle={handleEditToggle}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDelete}
            contact={{
              displayName: contact.displayName ?? undefined,
              contactEmail: contact.contactEmail ?? undefined,
            }}
          />
        </CardHeader>
        <CardContent className="pt-6">
          <ContactInfo
            contact={{
              displayName: contact.displayName ?? undefined,
              contactEmail: contact.contactEmail ?? undefined,
            }}
            isEditing={isEditing}
            editedDisplayName={editedDisplayName}
            onDisplayNameChange={setEditedDisplayName}
          />
        </CardContent>
      </Card>
    </div>
  );
}
