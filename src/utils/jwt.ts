import jwt from 'jsonwebtoken';

import { logger } from './logger';

interface JWTPayload {
  id: number;
}

export const generateJWT = (id: number): string => {
  return jwt.sign(<JWTPayload>{ id }, process.env.PRIVATE_KEY);
};

export const parseJWT = (token: string): number | null => {
  try {
    const { id } = jwt.verify(token, process.env.PRIVATE_KEY) as JWTPayload;

    return id || null;
  } catch (e) {
    logger.error(`JWT verify error: ${e.message}`);
    return null;
  }
};
