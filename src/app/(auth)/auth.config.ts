import type { NextAuthConfig } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { accounts, users } from '@/lib/db/schemas/auth';
import { db } from '@/lib/db';
import Google from 'next-auth/providers/google';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  adapter: DrizzleAdapter(db, {
    // @ts-expect-error - Changed primary key to email
    usersTable: users,
    accountsTable: accounts,
  }),
  providers: [Google],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnRegister = nextUrl.pathname.startsWith('/register');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isOnPrivacy = nextUrl.pathname.startsWith('/privacy');
      const isOnTerms = nextUrl.pathname.startsWith('/terms');
      const isOnLanding = nextUrl.pathname === '' || nextUrl.pathname === '/';

      if (isOnPrivacy || isOnTerms || isOnLanding) return true;

      if (!isLoggedIn && !(isOnLogin || isOnRegister)) {
        return Response.redirect(new URL('/login', nextUrl as unknown as URL));
      }

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL('/clubs', nextUrl as unknown as URL));
      }
      return true;
    },
    async redirect() {
      return '/clubs';
    },
  },
} satisfies NextAuthConfig;
