import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { decamelize } from '../../../common';
import { AppResponse, CreateUserInfo, UserInfo } from '../../../common/models';
import { camelize } from '../../../common/utils/transforms';
import { hash, setCookieUserId } from '../../../utils';
import { insertUser } from '../repository';

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

  const userInfo = await insertUser(user);
  if (!userInfo) {
    return resp.status(409).send(<AppResponse<never>>{
      errors: [`User already exists`],
    });
  }

  setCookieUserId(resp, userInfo.id);

  return resp.send(<AppResponse<UserInfo>>{
    data: decamelize(userInfo),
  });
};
