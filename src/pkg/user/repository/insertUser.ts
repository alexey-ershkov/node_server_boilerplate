import { pool } from '../../../database/pool';
import { CreateUserInfo } from '../../../models/User';
import { logger } from '../../../utils/logger';

const insertQuery =
  'insert into users (email, first_name, last_name, password) values ($1, $2, $3, $4) returning id';

export const insertUser = async (user: CreateUserInfo): Promise<null | number> => {
  try {
    const { rows } = await pool.query(insertQuery, [
      user.email,
      user.firstName,
      user.lastName,
      user.password,
    ]);
    return Promise.resolve(rows[0].id);
  } catch (e) {
    logger.error(`User insert into DB error: ${e.message}`);
    return Promise.resolve(null);
  }
};
