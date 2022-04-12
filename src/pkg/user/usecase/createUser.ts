import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { AppResponse } from '../../../models/AppResponse';
import { CreateUserInfo } from '../../../models/User';
import { setCookieUserId } from '../../../utils/cookie';
import { camelize, hash } from '../../../utils/transforms';
import { insertUser } from '../repository/insertUser';

export const createUserValidation = () => {
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

  const user = camelize(req.body) as CreateUserInfo;
  user.password = hash(user.password);

  const id = await insertUser(user);
  if (!id) {
    return resp.status(409).send(<AppResponse<never>>{
      errors: [`User already exists`],
    });
  }

  setCookieUserId(resp, id);

  return resp.send(<AppResponse<string>>{
    data: 'user inserted successfully',
  });
};
