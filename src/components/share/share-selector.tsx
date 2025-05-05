'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import type { ContactsForShare } from '@/lib/db/queries/contacts';
import type { GroupsForShare } from '@/lib/db/queries/groups';
import { Button } from '@/components/ui/button';
import { ContactShareListItem } from './contact-share-item';
import { GroupShareListItem } from './group-share-iteam';

interface ShareSelectorProps {
  contacts: ContactsForShare[];
  groups: GroupsForShare[];
  initialSelectedContacts?: string[];
  initialSelectedGroups?: string[];
  onSelectionChange: (
    selectedContactEmails: string[],
    selectedGroupNames: string[],
    allMemberEmails: string[],
  ) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function ShareSelector({
  contacts,
  groups,
  initialSelectedContacts = [],
  initialSelectedGroups = [],
  onSelectionChange,
  onSubmit,
  isSubmitting = false,
}: ShareSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set(initialSelectedContacts),
  );
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(
    new Set(initialSelectedGroups),
  );
  const [allMemberEmails, setAllMemberEmails] = useState<Set<string>>(
    new Set(initialSelectedContacts),
  );
  const [groupMemberEmails, setGroupMemberEmails] = useState<
    Map<string, string[]>
  >(new Map());

  // Update member emails when groups change
  useEffect(() => {
    // Process group selections
    const updatedGroupMemberEmails = new Map<string, string[]>();

    // Find all selected groups and get their member emails
    Array.from(selectedGroups).forEach((groupId) => {
      const group = groups.find((g) => g.name === groupId);
      if (group) {
        updatedGroupMemberEmails.set(groupId, group.members);
      }
    });

    // Only update if there's a change to avoid infinite loops
    if (
      JSON.stringify(Array.from(updatedGroupMemberEmails.entries())) !==
      JSON.stringify(Array.from(groupMemberEmails.entries()))
    ) {
      setGroupMemberEmails(updatedGroupMemberEmails);
    }
  }, [selectedGroups, groups, groupMemberEmails]);

  // Update all member emails when contacts or group members change
  useEffect(() => {
    const newAllMemberEmails = new Set<string>(Array.from(selectedContacts));

    // Add all emails from selected groups
    Array.from(groupMemberEmails.entries()).forEach(([, emails]) => {
      emails.forEach((email) => newAllMemberEmails.add(email));
    });

    const newEmailsArray = Array.from(newAllMemberEmails);
    if (
      JSON.stringify(newEmailsArray) !==
      JSON.stringify(Array.from(allMemberEmails))
    ) {
      setAllMemberEmails(newAllMemberEmails);

      // Notify parent component of changes
      onSelectionChange(
        Array.from(selectedContacts),
        Array.from(selectedGroups),
        newEmailsArray,
      );
    }
  }, [
    selectedContacts,
    groupMemberEmails,
    allMemberEmails,
    selectedGroups,
    onSelectionChange,
  ]);

  const handleSelect = useCallback((id: string, type: 'contact' | 'group') => {
    if (type === 'contact') {
      setSelectedContacts((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    } else {
      setSelectedGroups((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    }
  }, []);

  return (
    <div className="flex flex-col h-full space-y-2">
      {/* Make search bar sticky and add icon */}
      <div className="sticky top-0 z-10 bg-card pt-2 pb-2">
        <div className="flex gap-4 mx-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-[30%]"
          >
            {isSubmitting ? 'Sharing...' : 'Add and Share'}
          </Button>
        </div>
      </div>

      {/* Combine lists into one scrollable area */}
      <ScrollArea className="flex-grow border rounded-md p-2">
        <ul className="space-y-1">
          {/* Show empty state if both lists are empty */}
          {groups.length === 0 && contacts.length === 0 && (
            <li className="text-center text-muted-foreground p-4">
              No contacts or groups available.
            </li>
          )}

          {/* Groups section */}
          {groups.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium text-sm mb-2 px-2">Groups</h3>
              {groups
                .filter((group) =>
                  group.name.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((group) => (
                  <GroupShareListItem
                    key={group.name}
                    id={group.name}
                    group={group}
                    isSelected={selectedGroups.has(group.name)}
                    onSelect={handleSelect}
                  />
                ))}
              {groups.length > 0 &&
                groups.filter((group) =>
                  group.name.toLowerCase().includes(searchTerm.toLowerCase()),
                ).length === 0 && (
                  <li className="text-center text-muted-foreground p-4">
                    No groups found matching &apos{searchTerm}&apos.
                  </li>
                )}
            </div>
          )}

          {/* Contacts section */}
          {contacts.length > 0 && (
            <div>
              <h3 className="font-medium text-sm mb-2 px-2">Contacts</h3>
              {contacts
                .filter((contact) =>
                  (contact.displayName || contact.contactEmail)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
                )
                .map((contact) => (
                  <ContactShareListItem
                    key={contact.contactEmail}
                    id={contact.contactEmail}
                    contact={contact}
                    isSelected={selectedContacts.has(contact.contactEmail)}
                    onSelect={handleSelect}
                  />
                ))}
              {contacts.length > 0 &&
                contacts.filter((contact) =>
                  (contact.displayName || contact.contactEmail)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
                ).length === 0 && (
                  <li className="text-center text-muted-foreground p-4">
                    No contacts found matching &apos{searchTerm}&apos.
                  </li>
                )}
            </div>
          )}
        </ul>
      </ScrollArea>
    </div>
  );
}
