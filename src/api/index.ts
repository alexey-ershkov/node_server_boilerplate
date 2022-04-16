import type { RequestHandler } from 'express';
import { ValidationChain } from 'express-validator';

import { authMiddleware } from '../middlewares/auth';
import { getAllStocks, getStockBySymbol } from '../pkg/stock/usecase';
import { getStocksCandle, stockCandlesValidation } from '../pkg/stock/usecase/getStocksCandle';
import {
  addUserStock,
  authUser,
  authValidation,
  createUser,
  createUserValidation,
  getUser,
  getUserStocks,
  removeUserStock,
  userStockValidation,
} from '../pkg/user/usecase';
import { addBalance, addBalanceValidation } from '../pkg/user/usecase/addBalance';

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
      // Обновить баланс
      {
        url: '/balance',
        method: 'post',
        middlewares: [authMiddleware, addBalanceValidation()],
        handler: addBalance,
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
      // Query params:
      // - symbols обязательный. Акции через запятую (AAPL,IBM)
      // - resolution - разрешение, по умолчанию день
      // - timeFrom - получение информации с текущей даты, по умолчанию предыдущий день
      // - timeTo - до какой даты, по умолчанию текущая дата
      {
        url: '/candles',
        method: 'get',
        middlewares: [stockCandlesValidation()],
        handler: getStocksCandle,
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
