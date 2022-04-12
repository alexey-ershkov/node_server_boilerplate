import { pool } from '../../../database/pool';
import { User } from '../../../models/User';
import { camelize } from '../../../utils/transforms';

const baseQuery = 'select id, email, first_name, last_name, balance, password from users';
const selectByIdQuery = `${baseQuery} where id = $1`;
const selectByPasswordQuery = `${baseQuery} where email = $1`;

export const getUserById = async (id: number): Promise<User | null> => {
  const { rows, rowCount } = await pool.query(selectByIdQuery, [id]);
  return Promise.resolve(rowCount ? (camelize(rows[0]) as User) : null);
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const { rows, rowCount } = await pool.query(selectByPasswordQuery, [email]);
  return Promise.resolve(rowCount ? (camelize(rows[0]) as User) : null);
};
