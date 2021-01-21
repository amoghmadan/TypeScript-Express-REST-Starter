import { Router } from "express";
import { rootController } from "../controllers/root.controller";

const router: Router = Router();

router.get("/", rootController.helloWorld);

export default router;
