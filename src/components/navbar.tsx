"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, UserCog, Book, BookUser } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 p-3 text-sm md:flex-row md:justify-start md:gap-3 md:px-4 md:py-3 transition-colors rounded-lg",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
      )}
    >
      {icon}
      <span className="text-xs md:text-sm">{label}</span>
    </Link>
  );
};

export function Navbar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/clubs",
      icon: <Book className="h-5 w-5" />,
      label: "Clubs",
    },
    {
      href: "/manage-clubs",
      icon: <BookUser className="h-5 w-5" />,
      label: "Manage Clubs",
    },
    {
      href: "/contacts",
      icon: <Users className="h-5 w-5" />,
      label: "Contacts",
    },
    {
      href: "/groups",
      icon: <UserCog className="h-5 w-5" />,
      label: "Groups",
    },
  ];

  return (
    <>
      {/* Mobile Navigation (Bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background md:hidden">
        {routes.map((route) => (
          <NavItem
            key={route.href}
            href={route.href}
            icon={route.icon}
            label={route.label}
            isActive={pathname === route.href}
          />
        ))}
      </nav>

      {/* Desktop Navigation (Left Side) */}
      <nav className="hidden h-full w-64 flex-col border-r bg-background md:flex">
        <div className="px-3 py-4">
          <div className="space-y-1">
            {routes.map((route) => (
              <NavItem
                key={route.href}
                href={route.href}
                icon={route.icon}
                label={route.label}
                isActive={pathname === route.href}
              />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
