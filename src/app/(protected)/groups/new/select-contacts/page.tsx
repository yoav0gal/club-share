import { auth } from '@/app/(auth)/auth';
import { getContactsForSharing } from '@/lib/db/queries/contacts';
import { ContactSelector } from './contact-selector';

export default async function SelectContactsPage() {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return (
      <div className="text-center text-red-500 pt-12">
        Please sign in to access this page.
      </div>
    );
  }

  const contacts = await getContactsForSharing(userEmail);

  return <ContactSelector contacts={contacts} />;
}
