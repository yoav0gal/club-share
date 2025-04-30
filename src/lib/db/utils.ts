import { genSaltSync, hashSync } from 'bcryptjs';

export function generateHashedPassword(password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return hash;
}

export function generateDummyPassword() {
  const password = '1234';
  const hashedPassword = generateHashedPassword(password);

  return hashedPassword;
}
