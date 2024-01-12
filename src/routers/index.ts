import { Router } from 'express';

import apiRouter from './api';

export default new Map<string, Router>([['/api', apiRouter]]);
