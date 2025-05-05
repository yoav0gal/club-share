import { auth } from '@/app/(auth)/auth';
import { getClubDetailsAction } from '@/app/(protected)/clubs/actions';
import { ClubNameEditorForm } from './club-name-editor-form';
import type { ClubDetailPageProps } from '../../page';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function EditClubNamePage({
  params,
  searchParams,
}: ClubDetailPageProps & {
  searchParams: { memberEmails?: string | string[] };
}) {
  const session = await auth();
  if (!session?.user?.email) {
    return (
      <div className="text-center text-red-500 pt-12">
        Please sign in to access this page.
      </div>
    );
  }

  const awatiedParams = await params;

  const clubId =
    typeof awatiedParams.clubId === 'string' ? awatiedParams.clubId : '';
  if (!clubId) {
    console.error('EditClubNamePage: Invalid Club ID.');
    redirect('/clubs'); // Redirect if clubId is invalid
  }

  const clubDetails = await getClubDetailsAction(clubId);

  if (!clubDetails || !clubDetails.isOwner) {
    console.error(
      `EditClubNamePage: Club ${clubId} not found or user ${session.user.email} is not owner.`,
    );
    revalidatePath('/clubs');
    redirect('/clubs');
  }

  // Process member emails from search params
  const awaitedMemberEmails = searchParams.memberEmails ?? [];
  const memberEmails = Array.isArray(awaitedMemberEmails)
    ? awaitedMemberEmails
    : [awaitedMemberEmails];

  memberEmails.push(clubDetails.ownerEmail);

  return (
    <ClubNameEditorForm
      clubId={clubId}
      currentName={clubDetails.club.name}
      currentDetails={clubDetails.club.details} // Pass current details
      memberEmails={memberEmails}
    />
  );
}
