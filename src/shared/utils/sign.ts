import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';

interface ISignIn {
  username: string;
}

export default function signIn({ username }: ISignIn): string {
  const { secret, expiresIn } = authConfig.jwt;
  const token = sign({}, secret, {
    subject: username,
    expiresIn,
  });

  return token;
}
