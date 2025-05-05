'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ClubData {
  name?: string;
  details?: { type: string; name?: string; value: string }[];
}

interface FieldErrors {
  name?: string;
  details?: string[];
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

export function ClubForm({
  defaultValues = {},
  className,
  fieldErrors,
  title = 'Club Details',
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultValues?: ClubData;
  className?: string;
  fieldErrors?: FieldErrors;
  title?: string;
}) {
  const router = useRouter();
  const [details, setDetails] = useState<DetailField[]>(
    defaultValues.details?.map((d, i) => ({ ...d, id: i })) || [
      { id: 0, type: 'phone', value: '' },
    ],
  );

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

  const handleFormSubmit = (formData: FormData) => {
    const formmatedDetails = details.reduce(
      (acc, detail) => {
        acc[detail.type] = detail.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    formData.delete('details');
    formData.append('details', JSON.stringify(formmatedDetails));

    const clubName = formData.get('name') as string;
    const clubDetailsString = formData.get('details') as string;

    if (!clubName) {
      console.error('Club name is required.');

      return;
    }

    const params = new URLSearchParams();
    params.set('name', clubName);
    params.set('details', clubDetailsString);

    router.push(`/clubs/new/share?${params.toString()}`);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Back</span>
      </Button>
      <Card>
        <CardHeader className="text-center ">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Use a standard form element and handle submission manually */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleFormSubmit(formData);
            }}
            className="flex flex-col gap-6"
          >
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
                type="text"
                placeholder="Enter Club Name"
                defaultValue={defaultValues.name}
                required
              />
              {fieldErrors?.name && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>
              )}
            </div>
            {/* Hidden input to capture stringified details */}
            <input
              type="hidden"
              name="details"
              value={JSON.stringify(details)}
            />

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
                            <SelectItem key={option.value} value={option.value}>
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
                          handleDetailChange(detail.id, 'name', e.target.value)
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
                      } // Adjust input type based on selection
                      placeholder="Value"
                      value={detail.value}
                      onChange={(e) =>
                        handleDetailChange(detail.id, 'value', e.target.value)
                      }
                      required
                    />
                    {/* TODO: Add field error display for details */}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeDetailField(detail.id)}
                    disabled={details.length <= 1} // Disable removing if only one field exists
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

            {/* Replace children with a standard submit button */}
            <Button type="submit" className="w-full">
              Next: Share Club
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
