import type { Request, Response } from 'express';

import { AppResponse, UserInfo } from '../../../common/models';
import { decamelize } from '../../../common/utils/transforms';
import { selectUserStocksById } from '../repository';

export const getUserStocks = async (req: Request, resp: Response) => {
  const stocks = await selectUserStocksById(resp.locals.userId);

  return resp.send(<AppResponse<UserInfo>>{
    data: decamelize(stocks),
  });
};
