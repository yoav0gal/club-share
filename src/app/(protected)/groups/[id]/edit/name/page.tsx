import { auth } from '@/app/(auth)/auth';
import { getGroupDetailsAction } from '@/app/(protected)/groups/actions';
import { GroupNameEditorForm } from './group-name-editor-form';
import type { GroupPageProps } from '../../page';
import { redirect } from 'next/navigation';

export default async function EditGroupNamePage({
  params,
  searchParams,
}: GroupPageProps & {
  searchParams: Promise<{ memberEmails?: string | string[] }>;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    return (
      <div className="text-center text-red-500 pt-12">
        Please sign in to access this page.
      </div>
    );
  }

  const groupId = (await params).id;
  const groupDetails = await getGroupDetailsAction(groupId);

  if (!groupDetails || !groupDetails.isOwner) {
    console.error(
      `EditGroupNamePage: Group ${groupId} not found or user ${session.user.email} is not owner.`,
    );
    redirect('/groups');
  }

  const awaitedMemberEmails = (await searchParams).memberEmails ?? [];

  const memberEmails = Array.isArray(awaitedMemberEmails)
    ? awaitedMemberEmails
    : [awaitedMemberEmails];

  const ownerEmails = groupDetails.owners.map((owner) => owner.email);

  return (
    <GroupNameEditorForm
      groupId={groupId}
      currentName={groupDetails.group.name}
      ownerEmails={ownerEmails}
      memberEmails={memberEmails}
    />
  );
}
