import bcrypt from 'bcrypt';

const saltRounds = 10;

export default async function cryptHash(password: string) {
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
}
