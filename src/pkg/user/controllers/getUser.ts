import { Request, Response } from 'express';

import { pool } from '../../../database/pool';

export const getUser = (req: Request, resp: Response) => {
  pool
    .query('SELECT NOW()')
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.error(err));
  resp.send('Test');
};
