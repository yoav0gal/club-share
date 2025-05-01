import type { Group } from "@/lib/db/schemas/club-share";
import { getGroupDetailsAction } from "../actions";
import { GroupDetails } from "./GroupDetails";

interface GroupPageProps {
  params: {
    id: string;
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const groupDetails = await getGroupDetailsAction(params.id);

  if (!groupDetails) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-muted-foreground">
          Group not found or you don't have access to it.
        </div>
      </div>
    );
  }

  if (!groupDetails.isOwner) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-muted-foreground">
          You must be an owner to view this group's details.
        </div>
      </div>
    );
  }

  const formattedDetails: Group & {
    members: Array<{ email: string }>;
    owners: Array<{ email: string }>;
  } = {
    createdAt: groupDetails.group.createdAt,
    id: groupDetails.group.id,
    name: groupDetails.group.name,
    updatedAt: groupDetails.group.updatedAt,
    members: groupDetails.members.map((member) => ({
      email: member.email,
    })),
    owners: groupDetails.owners.map((owner) => ({
      email: owner.email,
    })),
  };

  return <GroupDetails group={formattedDetails} />;
}
