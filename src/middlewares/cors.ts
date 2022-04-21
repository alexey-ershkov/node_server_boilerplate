import dotenv from 'dotenv';
import type { NextFunction, Request, Response } from 'express';

dotenv.config();
const allowList = process.env.ALLOW_LIST.split(' ');

const getAllowOrigin = (req: Request): string => {
  const urlIdx = allowList.indexOf(req.headers.origin);
  if (urlIdx === -1) {
    return allowList[0];
  }

  return allowList[urlIdx];
};

// eslint-disable-next-line consistent-return
export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', getAllowOrigin(req));
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};

export default corsMiddleware;
