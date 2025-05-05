"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookUser, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getOwnedClubsAction } from "../clubs/actions";
import type { Club } from "@/lib/db/schemas/club-share";
import { ClubCard } from "@/components/clubs/club-card";

export default function ManageClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOwnedClubs() {
      setIsLoading(true);
      try {
        const ownedClubs = await getOwnedClubsAction();
        setClubs(ownedClubs);
      } catch (error) {
        console.error("Failed to fetch owned clubs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOwnedClubs();
  }, []);

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <div className="mb-6">
        <SearchBar
          placeholder="Search your clubs..."
          onChange={setSearchQuery}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Clubs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Manage the clubs you own and control access to.
          </p>

          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading your clubs...
            </div>
          ) : filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClubs.map((club) => (
                // Ensure ClubCard props match what it expects (id, name, ownerEmail)
                <ClubCard
                  key={club.id}
                  club={{
                    id: club.id,
                    name: club.name,
                    ownerEmail: club.ownerEmail,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              You don't have any clubs yet. Create one to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
