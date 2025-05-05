"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/toast";
import type { EditSharedWithItem } from "@/lib/db/queries/clubs"; // Updated type

// Define the prop type using the imported EditSharedWithItem
type ClubEditorProps = {
  sharedWith: EditSharedWithItem[];
  // TODO: Add groups if group editing is implemented
};

export function ClubEditor({ sharedWith }: ClubEditorProps) {
  const router = useRouter();
  const params = useParams();
  const clubId = params.clubId as string;
  const [selectedMemberEmails, setSelectedMemberEmails] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (sharedWith) {
      const initialSelected = sharedWith
        .filter((item) => item.isShared)
        .map((item) => item.email);
      setSelectedMemberEmails(initialSelected);
    }
  }, [sharedWith]);

  const handleMemberSelectionChange = (email: string) => {
    setSelectedMemberEmails((prevSelected) =>
      prevSelected.includes(email)
        ? prevSelected.filter((e) => e !== email)
        : [...prevSelected, email]
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

    // Navigate to the club name edit page
    router.push(`/clubs/${clubId}/edit/name?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-col items-center justify-start pt-12 md:pt-16 px-4 w-full">
      <div className="w-full max-w-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/clubs/${clubId}`)} // Navigate back to club details page
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
              {sharedWith.length === 0 ? (
                <p>
                  No contacts found.{" "}
                  <a href="/contacts/new" className="underline">
                    Add contacts
                  </a>{" "}
                  first.
                </p>
              ) : (
                <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                  {sharedWith.map((item) => (
                    <div
                      key={item.email} // Use email as key
                      className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Checkbox
                        id={`member-${item.email}`} // Use email in id
                        checked={selectedMemberEmails.includes(item.email)} // Check based on email
                        onCheckedChange={() =>
                          handleMemberSelectionChange(item.email)
                        } // Pass email to handler
                      />
                      <Label
                        htmlFor={`member-${item.email}`} // Use email in htmlFor
                        className="flex-1 font-normal cursor-pointer"
                      >
                        {item.name || item.email} {/* Display name or email */}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              {/* TODO: Add Group selection UI if needed */}

              <Button onClick={handleNext} className="w-full mt-4">
                Next: Edit Name & Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
