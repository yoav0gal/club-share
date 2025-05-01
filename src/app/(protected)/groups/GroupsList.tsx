"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Users } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import type { Group } from "@/lib/db/schemas/club-share";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type GroupWithMembers = Group & {
  members: Array<{ email: string }>;
};

type GroupsListProps = {
  groups: GroupWithMembers[];
};

export function GroupCard({ id, name, members }: GroupWithMembers) {
  return (
    <Link
      href={`/groups/${id}`}
      className="block hover:opacity-80 transition-opacity"
    >
      <Card key={id}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            {members.length} members
          </p>
          <div className="flex flex-wrap gap-2">
            {members.slice(0, 5).map((member) => (
              <div
                key={member.email}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium"
                title={member.email}
              >
                {member.email[0].toUpperCase()}
              </div>
            ))}
            {members.length > 5 && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                +{members.length - 5}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function GroupsList({ groups }: GroupsListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Groups</h1>
        </div>

        <Button size="sm" className="gap-1" asChild>
          <Link href="/groups/new/select-contacts">
            <PlusCircle className="h-4 w-4" />
            <span>New group</span>
          </Link>
        </Button>
      </div>
      <div className="mb-6">
        <SearchBar placeholder="Search groups..." onChange={setSearchQuery} />
      </div>

      {filteredGroups.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No groups match your search.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <GroupCard key={group.id} {...group} />
          ))}
        </div>
      )}
    </div>
  );
}
