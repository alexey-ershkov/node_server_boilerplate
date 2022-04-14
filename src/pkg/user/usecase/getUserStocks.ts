import type { Request, Response } from 'express';

import { AppResponse, UserInfo } from '../../../models';
import { decamelize } from '../../../utils';
import { selectUserStocksById } from '../repository/selectUserStocks';

export const getUserStocks = async (req: Request, resp: Response) => {
  const stocks = await selectUserStocksById(resp.locals.userId);

  return resp.send(<AppResponse<UserInfo>>{
    data: decamelize(stocks),
  });
};
