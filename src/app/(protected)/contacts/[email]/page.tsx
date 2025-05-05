import { getContactByEmailAction } from '../actions';
import { ContactDetails } from './contact-details';
import { notFound } from 'next/navigation';

export default async function ContactDetailsPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = await params;
  const contactEmail = Array.isArray(email)
    ? decodeURIComponent(email[0])
    : decodeURIComponent(email ?? '');

  const contact = await getContactByEmailAction(contactEmail);

  if (!contact) {
    notFound();
  }

  return <ContactDetails initialContact={contact} />;
}
