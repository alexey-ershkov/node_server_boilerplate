import { Request, Response } from 'express';
import { omit } from 'lodash';

import { AppResponse } from '../../../models/AppResponse';
import { UserInfo } from '../../../models/User';
import { getCookieUserId } from '../../../utils/cookie';
import { decamelize } from '../../../utils/transforms';
import { getUserById } from '../repository/getUser';

export const getUser = async (req: Request, resp: Response) => {
  const userId = getCookieUserId(req);
  if (!userId) {
    return resp.status(401).send(<AppResponse<never>>{
      errors: ['User not authorised'],
    });
  }

  const user = await getUserById(userId);
  if (!user) {
    return resp.status(404).send(<AppResponse<never>>{
      errors: ['user not found'],
    });
  }

  return resp.send(<AppResponse<UserInfo>>{
    data: decamelize(omit(user, ['password'])),
  });
};
