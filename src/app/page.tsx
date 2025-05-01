import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, Users, Share2 } from "lucide-react";
import { auth } from "@/app/(auth)/auth";

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-16 text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/club-share-logo.svg"
              alt="Club Share Logo"
              width={120}
              height={120}
              className="dark:invert hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl bg-gradient-to-r from-primary via-accent to-destructive bg-clip-text text-transparent animate-gradient-shift bg-400%">
              Find club. Share club.
            </h1>
            <p className="text-2xl text-muted-foreground font-light">
              One place for all your memberships
            </p>
          </div>
          <Link href={session ? "/clubs" : "/login"}>
            <Button
              size="lg"
              className="text-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {session ? "To the app!" : " login"}
            </Button>
          </Link>
        </header>

        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="mb-4 text-primary bg-primary/10 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Search size={32} />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Track Memberships</h3>
            <p className="text-muted-foreground text-sm">
              Keep all your clubs in one place
            </p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="mb-4 text-accent bg-accent/10 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Users size={32} />
            </div>
            <h3 className="mb-2 text-xl font-semibold">View Access</h3>
            <p className="text-muted-foreground text-sm">
              See available memberships instantly
            </p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="mb-4 text-accent bg-accent/10 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Share2 size={32} />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Share Instantly</h3>
            <p className="text-muted-foreground text-sm">
              Share with friends and family
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
