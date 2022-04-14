import type { Request, Response } from 'express';

import { AppResponse, Stock, UserInfo } from '../../../common/models';
import { decamelize } from '../../../common/utils/transforms';
import { selectUserStockBySymbolAndId, selectUserStocksById } from '../repository';

export const getUserStocks = async (req: Request, resp: Response) => {
  const stocks = await selectUserStocksById(resp.locals.userId);

  return resp.send(<AppResponse<UserInfo>>{
    data: decamelize(stocks),
  });
};

export const getUserStock = async (req: Request<{ symbol?: string }>, resp: Response) => {
  if (!resp.locals.userId) {
    return resp.status(401).send(<AppResponse<never>>{
      errors: ['User unauthorized'],
    });
  }

  const { userId } = resp.locals;
  if (req.params.symbol) {
    const stock = await selectUserStockBySymbolAndId(req.params.symbol, userId);
    if (!stock) {
      return resp.status(404).send(<AppResponse<never>>{
        errors: [`User with id ${userId} doesn't have ${req.params.symbol} stock`],
      });
    }

    return resp.send(<AppResponse<Stock & { count: number }>>{
      data: decamelize(stock),
    });
  }

  return resp.status(400).send(<AppResponse<never>>{
    errors: ['Invalid request'],
  });
};
