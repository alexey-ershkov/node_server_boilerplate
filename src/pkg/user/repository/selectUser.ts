import { User } from '../../../common/models';
import { camelize } from '../../../common/utils/transforms';
import { pool } from '../../../database/pool';

const baseQuery = 'select id, email, first_name, last_name, balance, password from users';
const selectByIdQuery = `${baseQuery} where id = $1`;
const selectByPasswordQuery = `${baseQuery} where email = $1`;

export const selectUserById = async (id: number | undefined): Promise<User | null> => {
  if (!id) {
    return null;
  }

  const { rows, rowCount } = await pool.query(selectByIdQuery, [id]);
  return rowCount ? (camelize(rows[0]) as User) : null;
};

export const selectUserByEmail = async (email: string): Promise<User | null> => {
  const { rows, rowCount } = await pool.query(selectByPasswordQuery, [email]);
  return rowCount ? (camelize(rows[0]) as User) : null;
};
