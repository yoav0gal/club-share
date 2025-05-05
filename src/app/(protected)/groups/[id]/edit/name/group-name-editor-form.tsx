'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/submit-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import {
  updateGroupAction,
  type MutationActionState,
} from '@/app/(protected)/groups/actions';
import Form from 'next/form';

interface GroupNameEditorFormProps {
  groupId: string;
  currentName: string;
  ownerEmails: string[];
  memberEmails: string[];
}

export function GroupNameEditorForm({
  groupId,
  currentName,
  ownerEmails,
  memberEmails,
}: GroupNameEditorFormProps) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [updateState, updateFormAction] = useActionState<
    MutationActionState,
    FormData
  >(updateGroupAction, { status: 'idle' });

  useEffect(() => {
    if (updateState.status === 'success') {
      router.push(`/groups`);
    }
  }, [updateState, router]);

  return (
    <div className="flex flex-col items-center justify-start pt-12 md:pt-16 px-4 w-full">
      <div className="w-full max-w-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to Member Selection</span>
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Edit Group Name</CardTitle>
          </CardHeader>
          <Form action={updateFormAction}>
            <CardContent className="grid gap-4 ">
              <input type="hidden" name="groupId" value={groupId} />

              {ownerEmails.map((email) => (
                <input
                  key={email}
                  type="hidden"
                  name="ownerEmails"
                  value={email}
                />
              ))}

              {memberEmails.map((email) => (
                <input
                  key={email}
                  type="hidden"
                  name="memberEmails"
                  value={email}
                />
              ))}

              <div className="grid gap-2 my-4">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={1}
                />
              </div>
              {updateState.status === 'failed' && (
                <p className="text-sm text-red-500">{updateState.message}</p>
              )}
              {updateState.status === 'invalid_data' && (
                <p className="text-sm text-red-500">
                  {updateState.message || 'Invalid data provided.'}
                </p>
              )}
              {updateState.status === 'unauthorized' && (
                <p className="text-sm text-red-500">
                  {updateState.message || 'You are not authorized.'}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <SubmitButton
                className="w-full"
                isSuccessful={updateState.status === 'success'}
              >
                Save Changes
              </SubmitButton>
            </CardFooter>
          </Form>
        </Card>
      </div>
    </div>
  );
}
