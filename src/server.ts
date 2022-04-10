import 'graphql-import-node';

import dotenv from 'dotenv';
import express from 'express';

import corsMiddleware from './middlewares/cors';

dotenv.config();
const PORT = process.env.PORT || 3000;

const server = express();
server.use(corsMiddleware);

server.get('/', (req, resp) => {
  resp.status(200);
  resp.send('Hello world');
});

server.listen(PORT);
console.log(`Server listening on port ${PORT}`);
