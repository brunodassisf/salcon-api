import * as bcrypt from 'bcrypt';

const saltRounds = 10;

async function cryptHash(password: string) {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function compareHash(password: string, hash: string) {
  const isAuth = bcrypt.compareSync(password, hash);
  return isAuth;
}

export { cryptHash, compareHash };
