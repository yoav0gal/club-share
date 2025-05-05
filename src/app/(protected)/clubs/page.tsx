import { Card, CardContent } from "@/components/ui/card";
import { Book, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllMemberClubsAction } from "./actions";
import { ClubsListClient } from "./clubs-list";
import type { ClubDetails } from "@/lib/db/queries/clubs";

export default async function ClubsPage() {
  let clubs: ClubDetails[] = [];
  let error = null;
  try {
    clubs = await getAllMemberClubsAction();
    console.log("Fetched clubs:", clubs);
  } catch (e) {
    console.error("Failed to fetch member clubs:", e);
    error = "Failed to load clubs. Please try again later.";
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Book className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Clubs</h1>
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
