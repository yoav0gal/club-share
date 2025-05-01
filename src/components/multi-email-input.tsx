"use client";

import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface MultiEmailInputProps {
  id: string;
  name: string;
  emails: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
}

export function MultiEmailInput({
  id,
  name,
  emails,
  onChange,
  placeholder = "Add email",
}: MultiEmailInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addEmail = (email: string) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) return;

    if (!emails.includes(trimmedEmail)) {
      onChange([...emails, trimmedEmail]);
    }
    setInputValue("");
  };

  const removeEmail = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    onChange(newEmails);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      addEmail(inputValue);
    }
  };

  return (
    <div className="border rounded-md p-2 flex flex-wrap gap-2">
      {emails.map((email, index) => (
        <Badge
          key={email}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {email}
          <button
            type="button"
            onClick={() => removeEmail(index)}
            className="hover:bg-destructive/20 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {email}</span>
          </button>
          <input type="hidden" name={name} value={email} />
        </Badge>
      ))}
      <Input
        id={id}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addEmail(inputValue)}
        placeholder={placeholder}
        className="flex-1 min-w-[200px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
