import type { RequestHandler } from 'express';
import { ValidationChain } from 'express-validator';

import { authMiddleware } from '../middlewares/auth';
import { getAllStocks, getStockBySymbol } from '../pkg/stock/usecase';
import { getStocksCandles } from '../pkg/stock/usecase/getStocksCandles';
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
      // Получить акции пользователя
      {
        url: '/stocks',
        method: 'get',
        middlewares: [authMiddleware],
        handler: getUserStocks,
      },
      // Получить акцию пользователя
      {
        url: '/stocks/:symbol',
        method: 'get',
        middlewares: [authMiddleware],
        handler: getUserStock,
      },
      // Post methods
      // Войти
      {
        url: '/login',
        method: 'post',
        middlewares: [authValidation()],
        handler: authUser,
      },
      // Зарегистрироваться
      {
        url: '/register',
        method: 'post',
        middlewares: [createUserValidation()],
        handler: createUser,
      },
      // Добавить акции
      {
        url: '/stocks',
        method: 'post',
        middlewares: [authMiddleware, userStockValidation()],
        handler: addUserStock,
      },
      // Delete methods
      // Удалить акции
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
      // Получить все акции
      {
        url: '/',
        method: 'get',
        middlewares: [],
        handler: getAllStocks,
      },
      // Получить свечи для акций
      {
        url: '/candles',
        method: 'get',
        middlewares: [],
        handler: getStocksCandles,
      },
      // Получить информацию об одной акции
      {
        url: '/:symbol',
        method: 'get',
        middlewares: [],
        handler: getStockBySymbol,
      },
    ],
  },
};
