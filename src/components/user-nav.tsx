'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, LogOut, Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

export function UserNav() {
  const { data: session, update: updateSession } = useSession();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    updateSession();
  }, []);

  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  if (!session) {
    return (
      <Button
        variant="outline"
        onClick={() => signIn()}
        className="rounded-full"
      >
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session.user?.image ?? undefined}
              alt={session.user?.name ?? 'User'}
            />
            <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <div className="flex justify-around px-1 py-1">
          <Button
            variant={theme === 'light' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTheme('light')}
            className="rounded-full"
          >
            <Sun className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Light</span>
          </Button>
          <Button
            variant={theme === 'dark' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTheme('dark')}
            className="rounded-full"
          >
            <Moon className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Dark</span>
          </Button>
          <Button
            variant={theme === 'system' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTheme('system')}
            className="rounded-full"
          >
            {/* Using a generic icon for system theme, consider importing Laptop or Monitor icon if available */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[1.2rem] w-[1.2rem]"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span className="sr-only">System</span>
          </Button>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
