import { Router } from 'express';

import apiRouter from '@/routers/api';

export default new Map<string, Router>([['/api', apiRouter]]);
