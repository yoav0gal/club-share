import { getClubDetailsAction } from "../actions";
import { ClubDetails } from "./club-details";

export interface ClubDetailPageProps {
  params: {
    clubId: string;
  };
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { clubId } = await params;
  const clubDetails = await getClubDetailsAction(clubId);

  if (!clubDetails) {
    // Option 1: Show a 'not found' message
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-muted-foreground">
          Club not found or you don't have access to it.
        </div>
      </div>
    );
  }

  // Pass the full clubDetails object which includes club, ownerEmail, and isOwner
  return <ClubDetails clubDetails={clubDetails} />;
}
