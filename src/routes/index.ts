import { Router } from 'express';

import apiRouter from '@/routes/api';

export default new Map<string, Router>([['/api', apiRouter]]);
