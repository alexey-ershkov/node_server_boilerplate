import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const allowList = process.env.ALLOW_LIST;

const corsOptionsDelegate = (req, cbk) => {
  cbk(null, { origin: allowList.includes(req.headers.origin) });
};
const corsMiddleware = cors(corsOptionsDelegate);

export default corsMiddleware;
