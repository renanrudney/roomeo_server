import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';

interface ISignIn {
  user_id: string;
}

export default function signIn({ user_id }: ISignIn): string {
  const { secret, expiresIn } = authConfig.jwt;
  const token = sign({}, secret, {
    subject: user_id,
    expiresIn,
  });

  return token;
}
