import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const PORT = process.env.PORT || 3000;

const allowList = process.env.ALLOW_LIST.split(' ');
const corsOptionsDelegate = (req, callback) => {
  callback(null, { origin: allowList.includes(req.headers.origin) });
};

const server = express();
server.use(cors(corsOptionsDelegate));

server.get('/', (req, resp) => {
  resp.status(200);
  resp.send('Hello world');
});

console.log(`Server listening on port ${PORT}`);
server.listen(PORT);
