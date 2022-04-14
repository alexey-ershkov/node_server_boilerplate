import { camelize } from '../../../common';
import { CreateUserInfo, UserInfo } from '../../../common/models';
import { pool } from '../../../database/pool';
import { logger } from '../../../utils';

const insertQuery =
  'insert into users (email, first_name, last_name, password) values ($1, $2, $3, $4) returning id, first_name, last_name, balance';

export const insertUser = async (user: CreateUserInfo): Promise<null | UserInfo> => {
  try {
    const { rows } = await pool.query(insertQuery, [
      user.email,
      user.firstName,
      user.lastName,
      user.password,
    ]);
    return camelize(rows[0]) as UserInfo;
  } catch (e) {
    logger.error(`User insert into DB error: ${e.message}`);
    return null;
  }
};
