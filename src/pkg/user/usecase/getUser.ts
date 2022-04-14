import { Request, Response } from 'express';
import { omit } from 'lodash';

import { AppResponse, UserInfo } from '../../../common/models';
import { decamelize } from '../../../common/utils/transforms';
import { selectUserById } from '../repository';

export const getUser = async (req: Request, resp: Response) => {
  const user = await selectUserById(resp.locals.userId);
  if (!user) {
    return resp.status(404).send(<AppResponse<never>>{
      errors: ['user not found'],
    });
  }

  return resp.send(<AppResponse<UserInfo>>{
    data: decamelize(omit(user, ['password'])),
  });
};
