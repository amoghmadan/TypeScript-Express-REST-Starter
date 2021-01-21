import { Request, Response } from "express";


class RootController {
    async helloWorld(req: Request, res: Response): Promise<void> {
        res.status(200).json({ hello: "World!" });
    }
}

export const rootController: RootController = new RootController();
