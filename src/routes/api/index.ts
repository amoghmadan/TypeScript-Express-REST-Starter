import { Router } from 'express';
import accountsRouter from '@/routes/api/accounts.router';

const routes: Map<string, Router> = new Map<string, Router>([
  ['/accounts', accountsRouter],
]);

const apiRouter = Router();
routes.forEach((router: Router, path: string): void => {
  apiRouter.use(path, router);
});

export default apiRouter;
