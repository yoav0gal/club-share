"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/search-bar";
import { ContactItem } from "@/components/contact-item";
import type { Contact } from "@/lib/db/schemas/club-share";
import { Users, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ContactListProps = {
  contacts: Contact[];
};

export function ContactList({ contacts }: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Contacts</h1>
        </div>

        <Button size="sm" className="gap-1" asChild>
          <Link href="/contacts/new">
            <PlusCircle className="h-4 w-4" />
            <span>Add Contact</span>
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="Search contacts..." onChange={setSearchQuery} />
      </div>

      <Card>
        <CardContent>
          {filteredContacts.length > 0 ? (
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <ContactItem key={contact.contactEmail} contact={contact} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              {contacts.length === 0
                ? "No contacts yet. Add contacts to start sharing clubs."
                : "No contacts match your search."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
