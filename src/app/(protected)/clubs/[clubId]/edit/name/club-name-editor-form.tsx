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
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import {
  updateClubAction,
  type MutationActionState,
} from '@/app/(protected)/clubs/actions';
import Form from 'next/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ClubNameEditorFormProps {
  clubId: string;
  currentName: string;
  currentDetails: Record<string, string>;
  memberEmails: string[];
}

interface DetailField {
  id: number;
  type: string;
  name?: string;
  value: string;
}

const detailOptions = [
  { value: 'phone', label: 'Phone' },
  { value: 'id', label: 'ID' },
  { value: 'email', label: 'Email' },
  { value: 'password', label: 'Password' },
  { value: 'username', label: 'Username' },
  { value: 'custom', label: 'Custom' },
];

export function ClubNameEditorForm({
  clubId,
  currentName,
  currentDetails,
  memberEmails,
}: ClubNameEditorFormProps) {
  const router = useRouter();
  const [name, setName] = useState(currentName);

  // Convert flat object structure to array of detail fields
  const [details, setDetails] = useState<DetailField[]>(() => {
    // If currentDetails is empty, start with one empty phone field
    if (!currentDetails || Object.keys(currentDetails).length === 0) {
      return [{ id: 0, type: 'phone', value: '' }];
    }

    return Object.entries(currentDetails).map(([key, value], index) => {
      const isStandardType = [
        'phone',
        'id',
        'email',
        'password',
        'username',
      ].includes(key.toLowerCase());

      return {
        id: index,
        type: isStandardType ? key.toLowerCase() : 'custom',
        name: isStandardType ? undefined : key,
        value: String(value),
      };
    });
  });

  const [updateState, updateFormAction] = useActionState<
    MutationActionState,
    FormData
  >(updateClubAction, { status: 'idle' });

  const addDetailField = () => {
    setDetails([...details, { id: Date.now(), type: 'phone', value: '' }]);
  };

  const removeDetailField = (id: number) => {
    setDetails(details.filter((detail) => detail.id !== id));
  };

  const handleDetailChange = (
    id: number,
    field: keyof DetailField,
    value: string,
  ) => {
    setDetails(
      details.map((detail) =>
        detail.id === id ? { ...detail, [field]: value } : detail,
      ),
    );
  };

  useEffect(() => {
    if (updateState.status === 'success') {
      router.push(`/clubs`); // Navigate to clubs list on success
    }
  }, [updateState, router]);

  return (
    <div className="flex flex-col items-center justify-start pt-4 md:pt-6 px-4 w-full">
      <div className="w-full max-w-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to Club</span>
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Edit Club Name & Details</CardTitle>
          </CardHeader>
          <Form action={updateFormAction}>
            <CardContent className="grid gap-6">
              <input type="hidden" name="clubId" value={clubId} />

              {/* Pass member emails as hidden inputs */}
              {memberEmails.map((email) => (
                <input
                  key={email}
                  type="hidden"
                  name="memberEmails"
                  value={email}
                />
              ))}

              {/* Hidden input for details (JSON string) */}
              <input
                type="hidden"
                name="details"
                value={JSON.stringify(
                  details.reduce(
                    (acc, detail) => {
                      const key =
                        detail.type === 'custom' ? detail.name : detail.type;
                      if (key) acc[key] = detail.value;
                      return acc;
                    },
                    {} as Record<string, string>,
                  ),
                )}
              />

              <div className="grid gap-2">
                <Label
                  htmlFor="name"
                  className="text-zinc-600 font-normal dark:text-zinc-400"
                >
                  Club Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  className="bg-muted text-md md:text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={1}
                  placeholder="Enter Club Name"
                />
              </div>

              {/* Dynamic Details Section */}
              <div className="grid gap-4">
                <Label className="text-zinc-600 font-normal dark:text-zinc-400">
                  Club Details
                </Label>
                {details.map((detail, index) => (
                  <div key={detail.id} className="flex items-end gap-2">
                    {detail.type !== 'custom' ? (
                      <div className="grid gap-2 flex-grow">
                        <Label
                          htmlFor={`detail-type-${detail.id}`}
                          className="sr-only"
                        >
                          Detail Type
                        </Label>
                        <Select
                          value={detail.type}
                          onValueChange={(value) =>
                            handleDetailChange(detail.id, 'type', value)
                          }
                        >
                          <SelectTrigger id={`detail-type-${detail.id}`}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {detailOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="grid gap-2 flex-grow">
                        <Label
                          htmlFor={`detail-name-${detail.id}`}
                          className="sr-only"
                        >
                          Field Name
                        </Label>
                        <Input
                          id={`detail-name-${detail.id}`}
                          name={`detail-name-${index}`}
                          className="bg-muted text-md md:text-sm"
                          type="text"
                          placeholder="Field Name"
                          value={detail.name || ''}
                          onChange={(e) =>
                            handleDetailChange(
                              detail.id,
                              'name',
                              e.target.value,
                            )
                          }
                          autoFocus
                          required
                        />
                      </div>
                    )}

                    <div className="grid gap-2 flex-grow">
                      <Label
                        htmlFor={`detail-value-${detail.id}`}
                        className="sr-only"
                      >
                        Value
                      </Label>
                      <Input
                        id={`detail-value-${detail.id}`}
                        name={`detail-value-${index}`}
                        className="bg-muted text-md md:text-sm"
                        type={
                          detail.type === 'email'
                            ? 'email'
                            : detail.type === 'password'
                              ? 'password'
                              : 'text'
                        }
                        placeholder="Value"
                        value={detail.value}
                        onChange={(e) =>
                          handleDetailChange(detail.id, 'value', e.target.value)
                        }
                        required
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => removeDetailField(detail.id)}
                      disabled={details.length <= 1}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove Detail</span>
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={addDetailField}
                  className="mt-2 justify-start w-fit"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Detail
                </Button>
              </div>

              {/* Display Action State Messages */}
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
                className="mt-6 w-full"
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
