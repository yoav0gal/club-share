"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookUser, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { useState } from "react";

export default function ManageClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BookUser className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Manage Clubs</h1>
        </div>

        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>New Club</span>
        </Button>
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
          <p className="text-muted-foreground">
            Manage the clubs you own and control access to.
          </p>

          <div className="py-8 text-center text-muted-foreground">
            You don't have any clubs yet. Create one to get started.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
