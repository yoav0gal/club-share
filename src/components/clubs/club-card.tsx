import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClubDetails } from "@/lib/db/queries/clubs";
import { KeyIcon, MailIcon, PhoneIcon, UserIcon, InfoIcon } from "lucide-react"; // Import icons

interface ClubCardProps {
  club: ClubDetails;
}

// Helper function to get icon based on detail type
const getDetailIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "password":
      return <KeyIcon className="w-4 h-4 mr-1 inline-block" />;
    case "email":
      return <MailIcon className="w-4 h-4 mr-1 inline-block" />;
    case "phone":
      return <PhoneIcon className="w-4 h-4 mr-1 inline-block" />;
    case "id":
      return <UserIcon className="w-4 h-4 mr-1 inline-block" />;
    default:
      return <InfoIcon className="w-4 h-4 mr-1 inline-block" />; // Generic icon for custom fields
  }
};

export function ClubCard({ club }: ClubCardProps) {
  const detailPriority = ["password", "email", "phone", "id"];
  const detailsEntries = Object.entries(club.details || {});

  const sortedDetails = detailsEntries.sort(([keyA], [keyB]) => {
    const indexA = detailPriority.indexOf(keyA.toLowerCase());
    const indexB = detailPriority.indexOf(keyB.toLowerCase());

    if (indexA !== -1 && indexB !== -1) return indexA - indexB; // Both are prioritized
    if (indexA !== -1) return -1; // Only A is prioritized
    if (indexB !== -1) return 1; // Only B is prioritized
    return keyA.localeCompare(keyB); // Neither is prioritized, sort alphabetically
  });

  const detailsToShow = sortedDetails.slice(0, 2);

  return (
    <Link
      href={`/clubs/${club.id}`}
      className="block hover:shadow-lg transition-shadow duration-200 rounded-lg"
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg mb-1">{club.name}</CardTitle>
          <p className="text-xs text-muted-foreground">
            Owner: {club.ownerEmail}
          </p>
        </CardHeader>
        <CardContent className="flex-grow">
          {detailsToShow.length > 0 ? (
            <ul className="space-y-1">
              {detailsToShow.map(([key, value]) => (
                <li
                  key={key}
                  className="text-sm text-muted-foreground flex items-center"
                >
                  {getDetailIcon(key)}
                  <span className="font-medium capitalize">{key}:</span>
                  <span className="ml-1 truncate">{value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No details available.
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
