import { Router } from "express";
import root from './root';

export default new Map<string, Router>([
    ['/api/root', root],
]);
