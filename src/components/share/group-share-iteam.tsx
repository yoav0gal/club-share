'use client';

import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle2, Users } from 'lucide-react';
import type { GroupsForShare } from '@/lib/db/queries/groups';

interface GroupShareListItemProps {
  id: string;
  group: GroupsForShare;
  isSelected: boolean;
  onSelect: (id: string, type: 'group') => void;
}

export function GroupShareListItem({
  id,
  group,
  isSelected,
  onSelect,
}: GroupShareListItemProps) {
  return (
    <li
      className={`flex items-center p-2 hover:bg-accent rounded-md cursor-pointer relative mb-0.75 ${
        isSelected ? 'bg-accent/50' : ''
      }`}
      onClick={() => onSelect(id, 'group')}
    >
      <div className="relative mr-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-muted text-muted-foreground">
            <Users className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        {isSelected && (
          <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-background rounded-full">
            <CheckCircle2 className="h-5 w-5 text-primary fill-primary-foreground" />
          </div>
        )}
      </div>
      <div className="flex-grow truncate">
        <span className="block text-sm font-medium">{group.name}</span>
        <span className="block text-xs text-muted-foreground">
          {group.size} member{group.size !== 1 ? 's' : ''}
        </span>
      </div>
    </li>
  );
}
