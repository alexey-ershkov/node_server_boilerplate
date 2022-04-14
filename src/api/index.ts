import type { RequestHandler } from 'express';
import { ValidationChain } from 'express-validator';

import { authMiddleware } from '../middlewares/auth';
import { getAllStocks, getStockBySymbol } from '../pkg/stock/usecase';
import {
  addUserStock,
  authUser,
  authValidation,
  createUser,
  createUserValidation,
  getUser,
  getUserStock,
  getUserStocks,
  removeUserStock,
  userStockValidation,
} from '../pkg/user/usecase';

export type Path = {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  middlewares: (RequestHandler | ValidationChain[])[];
  handler: RequestHandler;
};

export type Route = {
  prefix: string;
  paths: Path[];
};

export type Api = Record<'user' | 'stock', Route>;

export const api: Api = {
  user: {
    prefix: '/user',
    paths: [
      // Get methods
      {
        // Получить пользователя
        url: '/',
        method: 'get',
        middlewares: [authMiddleware],
        handler: getUser,
      },
      {
        url: '/stocks',
        method: 'get',
        middlewares: [authMiddleware],
        handler: getUserStocks,
      },
      {
        url: '/stocks/:symbol',
        method: 'get',
        middlewares: [authMiddleware],
        handler: getUserStock,
      },
      // Post methods
      {
        url: '/login',
        method: 'post',
        middlewares: [authValidation()],
        handler: authUser,
      },
      {
        url: '/register',
        method: 'post',
        middlewares: [createUserValidation()],
        handler: createUser,
      },
      {
        url: '/stocks',
        method: 'post',
        middlewares: [authMiddleware, userStockValidation()],
        handler: addUserStock,
      },
      // Delete methods
      {
        url: '/stocks',
        method: 'delete',
        middlewares: [authMiddleware, userStockValidation()],
        handler: removeUserStock,
      },
    ],
  },
  stock: {
    prefix: '/stock',
    paths: [
      // Get methods
      {
        url: '/',
        method: 'get',
        middlewares: [],
        handler: getAllStocks,
      },
      {
        url: '/:symbol',
        method: 'get',
        middlewares: [],
        handler: getStockBySymbol,
      },
    ],
  },
};
