import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface ContactInfoProps {
  contact: { contactEmail: string; displayName?: string };
  isEditing: boolean;
  editedDisplayName: string;
  onDisplayNameChange: (value: string) => void;
}

export function ContactInfo({
  contact,
  isEditing,
  editedDisplayName,
  onDisplayNameChange,
}: ContactInfoProps) {
  const initial = contact.displayName
    ? contact.displayName.charAt(0).toUpperCase()
    : '?';

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        {isEditing ? (
          <Input
            name="displayName"
            value={editedDisplayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            placeholder="Display Name"
            className="text-xl font-semibold"
            required
          />
        ) : (
          <p className="text-xl font-semibold">
            {contact.displayName || '(No display name)'}
          </p>
        )}
        <p className="text-sm text-muted-foreground">{contact.contactEmail}</p>
      </div>
    </div>
  );
}
