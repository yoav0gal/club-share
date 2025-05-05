import { Card, CardContent } from "@/components/ui/card";
import { BookUser, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getOwnedClubsAction } from "../clubs/actions";
import { ClubsListClient } from "../clubs/clubs-list";
import type { ClubDetails } from "@/lib/db/queries/clubs";

export default async function ManageClubsPage() {
  let clubs: ClubDetails[] = [];
  let error = null;
  try {
    clubs = await getOwnedClubsAction();
  } catch (e) {
    console.error("Failed to fetch owned clubs:", e);
    error = "Failed to load clubs. Please try again later.";
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BookUser className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Manage Clubs</h1>
        </div>

        <Link href="/clubs/new">
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>New Club</span>
          </Button>
        </Link>
      </div>

      {/* Render the client component, passing the fetched data */}
      {error ? (
        <Card>
          <CardContent className="py-8 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      ) : (
        <ClubsListClient initialClubs={clubs} />
      )}
    </div>
  );
}
