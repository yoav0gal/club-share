import { auth } from '@/app/(auth)/auth';
import { GroupEditor } from './group-editor';
import { groupEditDataAction } from '../../actions';
import type { GroupPageProps } from '../page';
import type { ContactWithChecked } from './group-editor';

export default async function SelectContactsPage({ params }: GroupPageProps) {
  const session = await auth();
  const { id } = await params;
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return (
      <div className="text-center text-red-500 pt-12">
        Please sign in to access this page.
      </div>
    );
  }

  const groupEditData = await groupEditDataAction(id);

  return (
    <GroupEditor contacts={groupEditData?.contacts as ContactWithChecked[]} />
  );
}
