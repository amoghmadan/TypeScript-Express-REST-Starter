import { Router } from "express";
import root from './root.route';
import person from './person.route';

export default new Map<string, Router>([
    ['/api/root', root],
    ['/api/person', person],
]);
