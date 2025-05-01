import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Contact } from "@/lib/db/schemas/club-share";
import { cn } from "@/lib/utils";

interface ContactItemProps {
  contact: Contact;
}

export function ContactItem({
  contact,
  className,
}: ContactItemProps & { className?: string }) {
  const initial = contact.displayName
    ? contact.displayName.charAt(0).toUpperCase()
    : "?";

  return (
    <Link
      href={`/contacts/${encodeURIComponent(contact.contactEmail)}`}
      className={cn(
        "flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        <Avatar>
          {/* If you have profile images, you can use AvatarImage here */}
          {/* <AvatarImage src={contact.imageUrl} alt={contact.displayName} /> */}
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{contact.displayName || "No Name"}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{contact.contactEmail}</p>
    </Link>
  );
}
