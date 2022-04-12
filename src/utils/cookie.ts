import type { Request, Response } from 'express';

import { generateJWT, parseJWT } from './jwt';

const cookieName = 'auth';

export const setCookieUserId = (resp: Response, userId: number) => {
  const expires = new Date();
  expires.setMonth(expires.getMonth() + 1);

  resp.cookie(cookieName, generateJWT(userId), {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 3600 * 1000 * 60 * 60 * 12),
    maxAge: 3600 * 1000 * 60 * 60 * 12,
  });
};

export const getCookieUserId = (req: Request): number | null => {
  if (req?.cookies[cookieName]) {
    return parseJWT(req.cookies[cookieName]);
  }

  return null;
};
