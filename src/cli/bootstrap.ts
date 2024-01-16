import { Server, ServerOptions } from 'http';

import express, { Application, Router } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

import routers from '../routers';
import { MONGODB_URI } from '../settings';

/**
 * Create request listener
 * @return {Application}
 */
export function getRequestListener(): Application {
  const application = express();
  application.use(helmet());
  application.use(express.urlencoded({ extended: true }));
  application.use(express.json());
  application.use(morgan('combined'));

  routers.forEach((router: Router, path: string): void => {
    application.use(path, router);
  });

  return application;
}

/**
 * Bootstrap application
 * @param {number} port
 * @param {string} host
 */
export default async function bootstrap(
  port: number,
  host: string,
): Promise<void> {
  const options: ServerOptions = {};
  const requestListener: Application = getRequestListener();
  const server: Server = new Server(options, requestListener);

  await mongoose.connect(MONGODB_URI);
  server.listen(port, host, (): void => {
    // eslint-disable-next-line no-console
    console.info(server.address());
  });
}
