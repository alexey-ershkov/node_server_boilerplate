import { compareSync } from 'bcrypt';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { omit } from 'lodash';

import { AppResponse } from '../../../models/AppResponse';
import { AuthUserInfo, UserInfo } from '../../../models/User';
import { setCookieUserId } from '../../../utils/cookie';
import { decamelize } from '../../../utils/transforms';
import { selectUserByEmail } from '../repository/selectUser';

export const authValidation = () => {
  return [
    body('password').exists().withMessage('Not exists').isString().withMessage('Not string'),
    body('email').exists().withMessage('Not exists').isEmail().withMessage('Invalid Email'),
  ];
};

export const authUser = async (req: Request, resp: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(400).send(<AppResponse<never>>{
      errors: errors.array(),
    });
  }

  const { email, password } = req.body as AuthUserInfo;
  const user = await selectUserByEmail(email);
  if (!user) {
    return resp.status(404).send(<AppResponse<never>>{
      errors: [`User with email ${email} not found`],
    });
  }

  if (!compareSync(password, user.password)) {
    return resp.status(401).send(<AppResponse<never>>{
      errors: [`Invalid password for user with email ${email}`],
    });
  }

  setCookieUserId(resp, user.id);

  return resp.send(<AppResponse<UserInfo>>{
    data: decamelize(omit(user, ['password'])),
  });
};
