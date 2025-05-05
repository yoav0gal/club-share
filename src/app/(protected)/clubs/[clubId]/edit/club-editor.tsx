'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search } from 'lucide-react'; // Added Search
import { toast } from '@/components/toast';
import type { EditSharedWithItem } from '@/lib/db/queries/clubs';
import Link from 'next/link';
import { ContactShareListItem } from '@/components/share/contact-share-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input'; // Added Input

type ClubEditorProps = {
  sharedWith: EditSharedWithItem[];
  // TODO: Add groups if group editing is implemented
};

export function ClubEditor({ sharedWith }: ClubEditorProps) {
  const router = useRouter();
  const params = useParams();
  const clubId = params.clubId as string;
  const [selectedMemberEmails, setSelectedMemberEmails] = useState<Set<string>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState(''); // Added search term state

  useEffect(() => {
    if (sharedWith) {
      const initialSelected = sharedWith
        .filter((item) => item.isShared)
        .map((item) => item.email);
      setSelectedMemberEmails(new Set(initialSelected));
    }
  }, [sharedWith]);

  const handleMemberSelectionChange = (
    email: string,
    type: 'contact' | 'group',
  ) => {
    if (type !== 'contact') return;
    setSelectedMemberEmails((prevSelected) => {
      const newSet = new Set(prevSelected);
      if (newSet.has(email)) {
        newSet.delete(email);
      } else {
        newSet.add(email);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (selectedMemberEmails.size === 0) {
      return toast({
        type: 'error',
        description: 'Please select at least one member',
      });
    }
    const searchParams = new URLSearchParams();
    selectedMemberEmails.forEach((email) => {
      searchParams.append('memberEmails', email);
    });

    router.push(`/clubs/${clubId}/edit/name?${searchParams.toString()}`);
  };

  // Filter sharedWith based on search term
  const filteredSharedWith = sharedWith.filter((item) =>
    (item.name || item.email).toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col items-center justify-start pt-4 md:pt-6 px-4 w-full ">
      <div className="w-full max-w-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/clubs/${clubId}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Edit Club Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* Sticky Search Bar */}
              <div className="sticky top-0 z-10 bg-card pt-2 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
              </div>

              {sharedWith.length === 0 ? (
                <p>
                  No contacts found.{' '}
                  <Link href="/contacts/new" className="underline">
                    Add contacts
                  </Link>{' '}
                  first.
                </p>
              ) : (
                <ScrollArea className="max-h-[50vh] pr-2">
                  {' '}
                  {/* Adjusted max height */}
                  <ul className="space-y-0.5">
                    {filteredSharedWith.length === 0 ? (
                      <li className="text-center text-muted-foreground p-4">
                        No members found matching &apos;{searchTerm}&apos;.
                      </li>
                    ) : (
                      filteredSharedWith.map((item) => (
                        <ContactShareListItem
                          key={item.email}
                          id={item.email}
                          contact={{
                            contactEmail: item.email,
                            displayName: item.name,
                            image: item.image ?? '',
                          }}
                          isSelected={selectedMemberEmails.has(item.email)}
                          onSelect={handleMemberSelectionChange}
                        />
                      ))
                    )}
                  </ul>
                </ScrollArea>
              )}
              {/* TODO: Add Group selection UI if needed */}

              <Button
                onClick={handleNext}
                className="w-full mt-4"
                disabled={selectedMemberEmails.size === 0}
              >
                Next: Edit Name & Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
