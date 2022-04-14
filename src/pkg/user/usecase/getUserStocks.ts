import type { Request, Response } from 'express';

import { AppResponse } from '../../../models/AppResponse';
import { UserInfo } from '../../../models/User';
import { decamelize } from '../../../utils/transforms';
import { selectUserStocksById } from '../repository/selectUserStocks';

export const getUserStocks = async (req: Request, resp: Response) => {
  const stocks = await selectUserStocksById(resp.locals.userId);

  return resp.send(<AppResponse<UserInfo>>{
    data: decamelize(stocks),
  });
};
