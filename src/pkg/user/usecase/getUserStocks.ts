import type { Request, Response } from 'express';

import { AppResponse, UserInfo } from '../../../common/models';
import { decamelize } from '../../../common/utils/transforms';
import {
  selectUserStockCountBySymbolAndId,
  selectUserStocksById,
} from '../repository/selectUserStocks';

export const getUserStocks = async (req: Request, resp: Response) => {
  const stocks = await selectUserStocksById(resp.locals.userId);

  return resp.send(<AppResponse<UserInfo>>{
    data: decamelize(stocks),
  });
};

export const getUserStockCount = async (req: Request<{ symbol?: string }>, resp: Response) => {
  if (!resp.locals.userId) {
    return resp.status(401).send(<AppResponse<never>>{
      errors: ['User unauthorized'],
    });
  }

  const { userId } = resp.locals;
  if (req.params.symbol) {
    const count = await selectUserStockCountBySymbolAndId(req.params.symbol, userId);
    if (!count) {
      return resp.status(404).send(<AppResponse<never>>{
        errors: [`User with id ${userId} doesn't have ${req.params.symbol} stock`],
      });
    }

    return resp.send(<AppResponse<number>>{
      data: count,
    });
  }

  return resp.status(400).send(<AppResponse<never>>{
    errors: ['Invalid request'],
  });
};
