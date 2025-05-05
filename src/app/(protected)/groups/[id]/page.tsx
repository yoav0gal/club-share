import type { Group } from '@/lib/db/schemas/club-share';
import { getGroupDetailsAction } from '../actions';
import { GroupDetails } from './group-details';

export interface GroupPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { id } = await params;
  const groupDetails = await getGroupDetailsAction(id);

  if (!groupDetails) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-muted-foreground">
          Group not found or you don&apos;t have access to it.
        </div>
      </div>
    );
  }

  const formattedDetails: Group & {
    members: Array<{ email: string }>;
  } = {
    createdAt: groupDetails.group.createdAt,
    id: groupDetails.group.id,
    name: groupDetails.group.name,
    updatedAt: groupDetails.group.updatedAt,
    members: groupDetails.members,
  };

  return <GroupDetails group={formattedDetails} />;
}
