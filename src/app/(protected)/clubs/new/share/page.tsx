'use client';

import { useState, useEffect, useActionState, startTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getClubSharingOptionsAction,
  newClubAction,
  type MutationActionState,
} from '../../actions';
import type { ContactsForShare } from '@/lib/db/queries/contacts';
import type { GroupsForShare } from '@/lib/db/queries/groups';
import { ShareSelector } from '@/components/share/share-selector';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/toast';
import { ArrowLeft } from 'lucide-react';

const initialState: MutationActionState = {
  status: 'idle',
};

export default function ShareClubPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clubName = searchParams.get('name') || '';
  const clubDetails = searchParams.get('details') || '{}';

  const [contacts, setContacts] = useState<ContactsForShare[]>([]);
  const [groups, setGroups] = useState<GroupsForShare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [fetchedContacts, fetchedGroups] =
          await getClubSharingOptionsAction();
        setContacts(fetchedContacts || []);
        setGroups(fetchedGroups || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch sharing options:', err);
        setError('Failed to load contacts and groups.');
        toast({
          type: 'error',
          description: 'Could not load sharing options.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-start pt-4 md:pt-6 px-4 w-full">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Loading Sharing Options...</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-start pt-4 md:pt-6 px-4 w-full text-red-500">
        <p>{error}</p>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <ShareClubPageContent
      clubName={clubName}
      clubDetails={clubDetails}
      contacts={contacts}
      groups={groups}
    />
  );
}

function ShareClubPageContent({
  clubName,
  clubDetails,
  contacts,
  groups,
}: {
  clubName: string;
  clubDetails: string;
  contacts: ContactsForShare[];
  groups: GroupsForShare[];
}) {
  const [selectedContactEmails, setSelectedContactEmails] = useState<string[]>(
    [],
  );
  const [selectedGroupNames, setSelectedGroupNames] = useState<string[]>([]);
  const [allMemberEmails, setAllMemberEmails] = useState<string[]>([]);
  const [formState, formAction] = useActionState<MutationActionState, FormData>(
    newClubAction,
    initialState,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSelectionChange = (
    contactEmails: string[],
    groupNames: string[],
    memberEmails: string[],
  ) => {
    setSelectedContactEmails(contactEmails);
    setSelectedGroupNames(groupNames);
    setAllMemberEmails(memberEmails);
  };

  useEffect(() => {
    // Track submission status
    if (formState.status === 'in_progress') {
      setIsSubmitting(true);
    } else {
      setIsSubmitting(false);
    }

    if (formState.status === 'success') {
      toast({
        type: 'success',
        description: formState.message || 'Club created successfully.',
      });

      router.push('/clubs');
    } else if (
      formState.status === 'failed' ||
      formState.status === 'invalid_data' ||
      formState.status === 'unauthorized'
    ) {
      toast({
        type: 'error',
        description: formState.message || 'An error occurred.',
      });
    }
  }, [formState, router]);

  if (!clubName) {
    router.push('/clubs/');
  }

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('name', clubName);
    formData.append('details', clubDetails);

    allMemberEmails.forEach((email) => formData.append('memberEmails', email));
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex flex-col items-center justify-start pt-4 md:pt-6 px-4 w-full h-[90%]">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="self-start mb-4"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Back</span>
      </Button>

      <Card className="w-full max-w-lg flex flex-col flex-grow overflow-hidden">
        <CardHeader>
          <CardTitle>Share &apos;{clubName}&apos; with</CardTitle>
        </CardHeader>
        {/* Make CardContent flexible and scrollable internally */}
        <CardContent className="flex-grow overflow-auto p-0">
          {/* ShareSelector now handles its own scrolling and submit */}
          <ShareSelector
            contacts={contacts}
            groups={groups}
            initialSelectedContacts={selectedContactEmails}
            initialSelectedGroups={selectedGroupNames}
            onSelectionChange={handleSelectionChange}
            onSubmit={handleSubmit} // Pass the wrapped submit handler
            isSubmitting={isSubmitting} // Pass submitting state
          />
        </CardContent>
        {/* Remove CardFooter as the button is now inside ShareSelector */}
      </Card>
    </div>
  );
}
