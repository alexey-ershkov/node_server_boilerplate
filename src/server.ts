import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import { api } from './api';
import corsMiddleware from './middlewares/cors';
import stockPackage from './pkg/stock';
import userPackage from './pkg/user';

dotenv.config();
const PORT = process.env.PORT || 3000;

const server = express();

server.use(morgan('dev'));
server.use(corsMiddleware);
server.use(bodyParser.json());
server.use(cookieParser());

const { user, stock } = api;

server.use(user.prefix, userPackage);
server.use(stock.prefix, stockPackage);

server.listen(PORT);
console.log(`Server listening on port ${PORT}`);
