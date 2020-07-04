import { Router } from 'express';
import { helloWorld } from '../controllers/root.controller';

const router: Router = Router();

router.get('/', helloWorld);

export default router;
