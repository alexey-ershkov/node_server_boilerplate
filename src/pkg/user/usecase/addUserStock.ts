import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { AppResponse, UserStock } from '../../../common/models';
import { selectStockBySymbol } from '../../stock/repository';
import { insertUserStock } from '../repository';

export const userStockValidation = () => [
  body('stockSymbol').exists().withMessage('Not exists').isString().withMessage('Not string'),
  body('count').exists().withMessage('Not exists').isInt({ min: 1 }).withMessage('Not number'),
];

export const addUserStock = async (req: Request, resp: Response) => {
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

  const userStockAdd = req.body as UserStock;
  userStockAdd.userId = resp.locals.userId;

  const stock = await selectStockBySymbol(userStockAdd.stockSymbol);
  if (!stock) {
    return resp.status(404).send(<AppResponse<never>>{
      errors: [`No stock with symbol ${userStockAdd.stockSymbol} found`],
    });
  }

  const count = await insertUserStock(userStockAdd);
  return resp.send(<AppResponse<{ count: number }>>{
    data: {
      count,
    },
  });
};
