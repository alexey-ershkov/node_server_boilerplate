import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { AppResponse, UserStock } from '../../../common/models';
import { selectStockBySymbol } from '../../stock/repository/selectStock';
import { deleteUserStocksBySymbolAndId } from '../repository/deleteUserStocks';
import { insertUserStock } from '../repository/insertUserStock';
import { selectUserStockCountBySymbolAndId } from '../repository/selectUserStocks';

export const removeUserStock = async (req: Request, resp: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(400).send(<AppResponse<never>>{
      errors: errors.array(),
    });
  }

  if (!resp.locals.userId) {
    return resp.status(401).send(<AppResponse<never>>{
      errors: ['User unauthorized'],
    });
  }

  const userStockRemove = req.body as UserStock;
  userStockRemove.userId = resp.locals.userId;

  const stock = await selectStockBySymbol(userStockRemove.stockSymbol);
  if (!stock) {
    return resp.status(404).send(<AppResponse<never>>{
      errors: [`No stock with symbol ${userStockRemove.stockSymbol} found`],
    });
  }

  const stockCount = await selectUserStockCountBySymbolAndId(
    userStockRemove.stockSymbol,
    userStockRemove.userId,
  );

  if (!stockCount) {
    return resp.status(404).send(<AppResponse<never>>{
      errors: [
        `User with id ${userStockRemove.userId} doesn't have ${userStockRemove.stockSymbol} stock`,
      ],
    });
  }

  if (stockCount < userStockRemove.count) {
    return resp.status(404).send(<AppResponse<never>>{
      errors: [
        `User with id ${userStockRemove.userId} have ${stockCount} ${userStockRemove.stockSymbol} stock. That is not enough`,
      ],
    });
  }

  userStockRemove.count = -userStockRemove.count;

  const newCount = await insertUserStock(userStockRemove);

  if (stockCount === -userStockRemove.count) {
    await deleteUserStocksBySymbolAndId(userStockRemove.stockSymbol, userStockRemove.userId);
  }

  return resp.send(<AppResponse<{ count: number }>>{
    data: {
      count: newCount,
    },
  });
};
