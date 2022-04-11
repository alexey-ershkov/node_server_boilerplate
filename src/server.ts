import dotenv from 'dotenv';
import express from 'express';

import corsMiddleware from './middlewares/cors';
import helloHandler from './pkg/hello';

dotenv.config();
const PORT = process.env.PORT || 3000;

const server = express();
server.use(corsMiddleware);

server.use('/', helloHandler);

server.listen(PORT);
console.log(`Server listening on port ${PORT}`);
