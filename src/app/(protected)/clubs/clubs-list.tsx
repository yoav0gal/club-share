"use client";

import { useState } from "react";
import { SearchBar } from "@/components/search-bar";
import type { ClubDetails } from "@/lib/db/queries/clubs";
import { ClubCard } from "@/components/clubs/club-card";

interface ClubsListClientProps {
  initialClubs: ClubDetails[];
}

export function ClubsListClient({ initialClubs }: ClubsListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClubs = initialClubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="mb-6">
        <SearchBar placeholder="Search clubs..." onChange={setSearchQuery} />
      </div>

      {/* No loading state needed here as data is fetched on server */}
      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          {searchQuery
            ? "No clubs match your search."
            : "No clubs available yet. Connect with friends or join clubs to see them here."}
        </div>
      )}
    </>
  );
}
