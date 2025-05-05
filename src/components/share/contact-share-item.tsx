'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2 } from 'lucide-react';
import type { ContactsForShare } from '@/lib/db/queries/contacts';

interface ContactShareListItemProps {
  id: string;
  contact: ContactsForShare;
  isSelected: boolean;
  onSelect: (id: string, type: 'contact') => void;
}

const getInitials = (name: string | null): string => {
  if (!name) return '?';
  const names = name.trim().split(' ');
  if (names.length === 1 && names[0].length > 0) {
    return names[0].charAt(0).toUpperCase();
  }
  if (names.length > 1) {
    return (
      (names[0].charAt(0) || '') + (names[names.length - 1].charAt(0) || '')
    ).toUpperCase();
  }
  return '?';
};

export function ContactShareListItem({
  id,
  contact,
  isSelected,
  onSelect,
}: ContactShareListItemProps) {
  const nameToDisplay = contact.displayName || contact.contactEmail;
  const initials = getInitials(contact.displayName);

  return (
    <li
      className={`flex items-center p-2 hover:bg-accent rounded-md cursor-pointer relative mb-0.75 ${
        isSelected ? 'bg-accent/50' : ''
      }`}
      onClick={() => onSelect(id, 'contact')}
    >
      <div className="relative mr-3">
        <Avatar className="h-10 w-10">
          {contact.image ? (
            <AvatarImage src={contact.image} alt={nameToDisplay} />
          ) : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {isSelected && (
          <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-background rounded-full">
            <CheckCircle2 className="h-5 w-5 text-primary fill-primary-foreground" />
          </div>
        )}
      </div>
      <div className="flex-grow truncate">
        <span className="block text-sm font-medium">{nameToDisplay}</span>
        {/* Optionally display email if different from name and needed */}
        {contact.displayName && contact.contactEmail && (
          <span className="block text-xs text-muted-foreground">
            {contact.contactEmail}
          </span>
        )}
      </div>
    </li>
  );
}
