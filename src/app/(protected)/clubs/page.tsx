"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { useState } from "react";

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Book className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Clubs</h1>
        </div>

        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>New Club</span>
        </Button>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="Search clubs..." onChange={setSearchQuery} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accessible Clubs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            View all the clubs you have access to through your contacts.
          </p>

          <div className="py-8 text-center text-muted-foreground">
            No clubs available yet. Connect with friends to see their clubs.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
