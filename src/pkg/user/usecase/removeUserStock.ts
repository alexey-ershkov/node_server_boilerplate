import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { AppResponse, UserStock } from '../../../common/models';
import { selectStockBySymbol } from '../../stock/repository';
import {
  deleteUserStocksBySymbolAndId,
  insertUserStock,
  selectUserStockBySymbolAndId,
} from '../repository';
import { updateBalance } from '../repository/updateBalance';

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

  const userStock = await selectUserStockBySymbolAndId(
    userStockRemove.stockSymbol,
    userStockRemove.userId,
  );

  if (!userStock) {
    return resp.status(404).send(<AppResponse<never>>{
      errors: [
        `User with id ${userStockRemove.userId} doesn't have ${userStockRemove.stockSymbol} stock`,
      ],
    });
  }

  if (userStock.count < userStockRemove.count) {
    return resp.status(404).send(<AppResponse<never>>{
      errors: [
        `User with id ${userStockRemove.userId} have ${userStock.count} ${userStockRemove.stockSymbol} stocks. That is not enough`,
      ],
    });
  }

  userStockRemove.count = -userStockRemove.count;

  const newCount = await insertUserStock(userStockRemove);

  await updateBalance(resp.locals.userId, userStock.count * stock.currentPrice);

  if (userStock.count === -userStockRemove.count) {
    await deleteUserStocksBySymbolAndId(userStockRemove.stockSymbol, userStockRemove.userId);
  }

  return resp.send(<AppResponse<{ count: number }>>{
    data: {
      count: newCount,
    },
  });
};
