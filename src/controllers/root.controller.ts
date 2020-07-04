import { Request, Response } from 'express';

const helloWorld = async (req: Request, res: Response): Promise<Response<any>> => {
    return res.json({ hello: 'World!' }).status(200);
}

export { helloWorld };
