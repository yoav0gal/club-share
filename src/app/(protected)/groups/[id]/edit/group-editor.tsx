"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Contact } from "@/lib/db/schemas/club-share";
import { toast } from "@/components/toast";

export type ContactWithChecked = Contact & { checked: boolean };

type ContactSelectorProps = {
  contacts: ContactWithChecked[];
};

export function GroupEditor({ contacts }: ContactSelectorProps) {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;
  const [selectedMemberEmails, setSelectedMemberEmails] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (contacts) {
      const initialSelected = contacts
        .filter((contact) => contact.checked)
        .map((contact) => contact.contactEmail);
      setSelectedMemberEmails(initialSelected);
    }
  }, [contacts]);

  const handleMemberSelectionChange = (contactEmail: string) => {
    setSelectedMemberEmails((prevSelected) =>
      prevSelected.includes(contactEmail)
        ? prevSelected.filter((email) => email !== contactEmail)
        : [...prevSelected, contactEmail]
    );
  };

  const handleNext = () => {
    if (selectedMemberEmails.length === 0) {
      return toast({
        type: "error",
        description: "Please select at least one member",
      });
    }
    const searchParams = new URLSearchParams();
    selectedMemberEmails.forEach((email) => {
      searchParams.append("memberEmails", email);
    });

    router.push(`/groups/${groupId}/edit/name?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-col items-center justify-start pt-12 md:pt-16 px-4 w-full">
      <div className="w-full max-w-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/groups/${groupId}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Edit Members</CardTitle>{" "}
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {contacts.length === 0 ? (
                <p>
                  No contacts found.{" "}
                  <a href="/contacts/new" className="underline">
                    Add contacts
                  </a>{" "}
                  first.
                </p>
              ) : (
                <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                  {contacts.map((contact) => (
                    <div
                      key={contact.contactEmail}
                      className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Checkbox
                        id={`member-${contact.contactEmail}`}
                        checked={selectedMemberEmails.includes(
                          contact.contactEmail
                        )}
                        onCheckedChange={() =>
                          handleMemberSelectionChange(contact.contactEmail)
                        }
                      />
                      <Label
                        htmlFor={`member-${contact.contactEmail}`}
                        className="flex-1 font-normal cursor-pointer"
                      >
                        {contact.displayName || contact.contactEmail}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={handleNext} className="w-full mt-4">
                Next: Edit Name
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
