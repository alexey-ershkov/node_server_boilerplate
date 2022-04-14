import { Quote } from '../../../common/models';
import { pool } from '../../../database/pool';
import { logger } from '../../../utils';

const insertQuery =
  'insert into quote (symbol, current_price, change, percent_change, high, ' +
  'low, open, prev_close, updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)';

const updateQuery =
  'update quote set (current_price, change, percent_change, high, low, open,  ' +
  'prev_close, updated_at) = ($1,$2,$3,$4,$5,$6,$7,$8) where symbol = $9;';

export const insertQuote = async ({
  symbol,
  currentPrice,
  change,
  percentChange,
  high,
  low,
  open,
  prevClose,
  updatedAt,
}: Quote): Promise<boolean> => {
  try {
    await pool.query(insertQuery, [
      symbol,
      currentPrice,
      change,
      percentChange,
      high,
      low,
      open,
      prevClose,
      updatedAt,
    ]);

    return true;
  } catch (e) {
    logger.error(`Error when inserting quote ${e.message}`);
    return false;
  }
};

export const updateQuote = async ({
  symbol,
  currentPrice,
  change,
  percentChange,
  high,
  low,
  open,
  prevClose,
  updatedAt,
}: Quote): Promise<boolean> => {
  try {
    await pool.query(updateQuery, [
      currentPrice,
      change,
      percentChange,
      high,
      low,
      open,
      prevClose,
      updatedAt,
      symbol,
    ]);

    return true;
  } catch (e) {
    logger.error(`Error when updating quote ${e.message}`);

    return false;
  }
};
