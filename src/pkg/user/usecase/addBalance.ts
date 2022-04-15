import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { decamelize, UserInfo } from '../../../common';
import { AppResponse } from '../../../common/models';
import { updateBalance } from '../repository/updateBalance';

export const addBalanceValidation = () => [
  body('count').exists().withMessage('Not exists').isInt({ min: 1 }).withMessage('Not number'),
];

export const addBalance = async (req: Request, resp: Response) => {
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

  const user = await updateBalance(resp.locals.userId, req.body.count);

  if (!user) {
    return resp.status(404).send(<AppResponse<never>>{
      errors: ['Not found'],
    });
  }

  return resp.send(<AppResponse<UserInfo>>{
    data: decamelize(user),
  });
};
