import { Router } from 'express';
import accountsRouter from '@/routers/api/accounts.router';

const urlPatterns: Map<string, Router> = new Map<string, Router>([
  ['/accounts', accountsRouter],
]);

const apiRouter = Router();
urlPatterns.forEach((router: Router, path: string): void => {
  apiRouter.use(path, router);
});

export default apiRouter;
