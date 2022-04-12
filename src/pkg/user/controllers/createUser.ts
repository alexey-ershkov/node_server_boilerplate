import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { insertUser } from '../../../database/insertUser';
import { AppResponse } from '../../../models/AppResponse';
import type { User } from '../../../models/User';
import { camelize } from '../../../utils/transforms';

export const userValidation = () => {
  return [
    body(['first_name', 'last_name', 'password'])
      .exists()
      .withMessage('Not exists')
      .isString()
      .withMessage('Not string'),
    body('email').exists().withMessage('Not exists').isEmail().withMessage('Invalid Email'),
  ];
};

export const createUser = async (req: Request, resp: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(400).send(<AppResponse<never>>{
      errors: errors.array(),
    });
  }

  const user = camelize(req.body) as User;

  const ok = await insertUser(user);
  if (!ok) {
    return resp.status(409).send(<AppResponse<never>>{
      errors: [`User already exists`],
    });
  }

  return resp.send(<AppResponse<string>>{
    data: 'user inserted successfully',
  });
};
