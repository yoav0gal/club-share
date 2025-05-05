'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search } from 'lucide-react'; // Added Search
import Link from 'next/link';
import { ContactShareListItem } from '@/components/share/contact-share-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import type { ContactsForShare } from '@/lib/db/queries/contacts';

type ContactSelectorProps = {
  contacts: ContactsForShare[];
};

export function ContactSelector({ contacts }: ContactSelectorProps) {
  const router = useRouter();
  const [selectedMemberEmails, setSelectedMemberEmails] = useState<Set<string>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState(''); // Added search term state

  const handleMemberSelectionChange = (
    contactEmail: string,
    type: 'contact' | 'group',
  ) => {
    if (type !== 'contact') return;
    setSelectedMemberEmails((prevSelected) => {
      const newSet = new Set(prevSelected);
      if (newSet.has(contactEmail)) {
        newSet.delete(contactEmail);
      } else {
        newSet.add(contactEmail);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (selectedMemberEmails.size === 0) {
      alert('Please select at least one contact');
      return;
    }
    const searchParams = new URLSearchParams();
    selectedMemberEmails.forEach((email) => {
      searchParams.append('memberEmails', email);
    });
    router.push(`/groups/new?${searchParams.toString()}`);
  };

  // Filter contacts based on search term
  const filteredContacts = contacts.filter((contact) =>
    (contact.displayName || contact.contactEmail)
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col items-center justify-start pt-4 md:pt-6 px-4 w-full">
      <div className="w-full max-w-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/groups')}
          className="mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Select Group Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* Sticky Search Bar */}
              <div className="sticky top-0 z-10 bg-card pt-2 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
              </div>

              {contacts.length === 0 ? (
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
                    {filteredContacts.length === 0 ? (
                      <li className="text-center text-muted-foreground p-4">
                        No contacts found matching &apos;{searchTerm}&apos;.
                      </li>
                    ) : (
                      filteredContacts.map((contact) => (
                        <ContactShareListItem
                          key={contact.contactEmail}
                          id={contact.contactEmail}
                          contact={{
                            contactEmail: contact.contactEmail,
                            displayName: contact.displayName,
                            image: contact.image ?? '',
                          }}
                          isSelected={selectedMemberEmails.has(
                            contact.contactEmail,
                          )}
                          onSelect={handleMemberSelectionChange}
                        />
                      ))
                    )}
                  </ul>
                </ScrollArea>
              )}

              <Button
                onClick={handleNext}
                className="w-full mt-4"
                disabled={selectedMemberEmails.size === 0}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
