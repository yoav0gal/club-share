import { auth } from "@/app/(auth)/auth";
import { getAllContacts } from "@/lib/db/queries/contacts";
import { ContactList } from "./ContactList";

export default async function ContactsPage() {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return (
      <div className="text-center text-red-500 pt-12">
        Please sign in to access this page.
      </div>
    );
  }

  const contacts = await getAllContacts(userEmail);

  return <ContactList contacts={contacts} />;
}
