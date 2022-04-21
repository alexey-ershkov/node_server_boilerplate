import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import corsMiddleware from './middlewares/cors';
import helloHandler from './pkg/hello';

dotenv.config();
const PORT = process.env.PORT || 3000;

const server = express();

server.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
server.use(corsMiddleware);
server.use(bodyParser.json());
server.use(cookieParser());

server.use('/', helloHandler);

server.listen(PORT);
console.log(`Server listening on port ${PORT}`);
