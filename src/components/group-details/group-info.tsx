import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiEmailInput } from "@/components/multi-email-input";

interface GroupInfoProps {
  group: { id: string; name: string; members: Array<{ email: string }> };
  isEditing: boolean;
  editedName: string;
  editedOwnerEmails: string[];
  editedMemberEmails: string[];
  onNameChange: (value: string) => void;
  onOwnerEmailsChange: (value: string[]) => void;
  onMemberEmailsChange: (value: string[]) => void;
}

export function GroupInfo({
  group,
  isEditing,
  editedName,
  editedOwnerEmails,
  editedMemberEmails,
  onNameChange,
  onOwnerEmailsChange,
  onMemberEmailsChange,
}: GroupInfoProps) {
  return (
    <div className="grid gap-4">
      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              name="name"
              value={editedName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Group Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerEmails">Group Owners</Label>
            <MultiEmailInput
              id="ownerEmails"
              name="ownerEmails"
              emails={editedOwnerEmails}
              onChange={onOwnerEmailsChange}
              placeholder="Add owner emails"
            />
            <p className="text-xs text-muted-foreground">
              Owners can edit and delete the group
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memberEmails">Group Members</Label>
            <MultiEmailInput
              id="memberEmails"
              name="memberEmails"
              emails={editedMemberEmails}
              onChange={onMemberEmailsChange}
              placeholder="Add member emails"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            {group.members.length} members
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
            {group.members.map((member) => (
              <div
                key={member.email}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-medium"
                  title={member.email}
                >
                  {member.email[0].toUpperCase()}
                </div>
                <span
                  className="text-xs text-center truncate w-full"
                  title={member.email}
                >
                  {member.email.split("@")[0]}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
