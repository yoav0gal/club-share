import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchBarProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Search...",
  onChange,
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative flex-1 max-w-md ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-9 w-full bg-background"
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
