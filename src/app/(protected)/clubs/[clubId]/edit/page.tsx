import { auth } from '@/app/(auth)/auth';
import { clubEditDataAction } from '../../actions';
import type { ClubDetailPageProps } from '../page';
import { ClubEditor } from './club-editor';

export default async function SelectClubMembersPage({
  params,
}: ClubDetailPageProps) {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return (
      <div className="text-center text-red-500 pt-12">
        Please sign in to access this page.
      </div>
    );
  }

  // Ensure params.clubId exists and is a string
  const clubId = typeof params.clubId === 'string' ? params.clubId : '';
  if (!clubId) {
    return (
      <div className="text-center text-red-500 pt-12">Invalid Club ID.</div>
    );
  }

  const clubEditData = await clubEditDataAction(clubId);

  if ('status' in clubEditData) {
    return (
      <div className="text-center text-red-500 pt-12">
        Could not load club data or you don&apos;t have permission.
      </div>
    );
  }

  return <ClubEditor sharedWith={clubEditData.sharedWith} />;
}
