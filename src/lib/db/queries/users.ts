'use server';

import { eq } from 'drizzle-orm';
import { users, type User } from '../schemas/auth';
import { generateHashedPassword } from '../utils';
import { db } from '..';

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(users).where(eq(users.email, email));
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string,
) {
  const hashedPassword = generateHashedPassword(password);

  try {
    return await db
      .insert(users)
      .values({ email, name, password: hashedPassword });
  } catch (error) {
    console.error('Failed to create user in database');
    throw error;
  }
}
