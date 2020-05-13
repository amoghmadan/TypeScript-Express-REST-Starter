import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ hello: 'World!' });
});

export default router;
