/* eslint-disable @typescript-eslint/no-explicit-any */
import { compare } from 'bcryptjs';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUser } from '@/lib/db/queries/users';
import { authConfig } from './auth.config';
import { DUMMY_PASSWORD } from '@/lib/constants';

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    ...(authConfig.providers || []),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize({ email, password }: any) {
        const users = await getUser(email);

        if (users.length === 0) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const [user] = users;

        if (!user.password) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) return null;

        return user as any;
      },
    }),
  ],
  callbacks: {
    ...(authConfig.callbacks || {}),
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;

      token: { [key: string]: unknown };
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
  session: { strategy: 'jwt' },
});
