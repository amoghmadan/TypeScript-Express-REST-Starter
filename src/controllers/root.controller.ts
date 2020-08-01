import { Request, Response } from 'express';


class RootController {
    helloWorld = async (req: Request, res: Response): Promise<Response<any>> => {
        return res.json({ hello: 'World!' }).status(200);
    }
}

export const rootController: RootController = new RootController();
