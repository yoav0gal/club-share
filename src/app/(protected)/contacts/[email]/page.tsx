import { getContactByEmailAction } from '../actions';
import { ContactDetails } from './contact-details';
import { notFound } from 'next/navigation';

export default async function ContactDetailsPage({
  params,
}: {
  params: { email: string };
}) {
  const contactEmail = Array.isArray(params.email)
    ? decodeURIComponent(params.email[0])
    : decodeURIComponent(params.email ?? '');

  const contact = await getContactByEmailAction(contactEmail);

  if (!contact) {
    notFound();
  }

  return <ContactDetails initialContact={contact} />;
}
