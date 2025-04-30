import { AppLogo } from '@/components/app-logo';
import { UserNav } from '@/components/user-nav';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-muted bg-muted shadow-sm">
      <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <AppLogo />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent font-bold sm:inline-block">
              ClubShare
            </span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
