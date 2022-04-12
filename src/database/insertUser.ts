import { values } from 'lodash';

import { User } from '../models/User';
import { logger } from '../utils/logger';
import { pool } from './pool';

const insertQuery =
  'insert into users (email, first_name, last_name, password) values ($1, $2, $3, $4)';

export const insertUser = async (user: User): Promise<boolean> => {
  try {
    await pool.query(insertQuery, values(user));
    return Promise.resolve(true);
  } catch (e) {
    logger.error(`User insert into DB error: ${e.message}`);
    return Promise.resolve(false);
  }
};
