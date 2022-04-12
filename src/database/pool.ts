import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
export const pool = new Pool();
