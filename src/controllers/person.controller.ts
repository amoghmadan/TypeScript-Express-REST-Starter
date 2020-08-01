import { Request, Response } from 'express';
import { Person } from '../interfaces/person.interface';
import { PersonModel } from '../models/person.model';

class PersonController {
    fetchAll = async (req: Request, res: Response): Promise<Response<Person[] | null>> => {
        let people: Person[] = await PersonModel.find();
        return res.json(people).status(200);
    }

    fetchOne = async (req: Request, res: Response): Promise<Response<Person | null>> => {
        let person: Person | null = await PersonModel.findOne({ _id: req.params.id });
        return res.json(person).status(200);
    }

    createOne = async (req: Request, res: Response): Promise<Response<Person | null>> => {
        let newPerson: Person = new PersonModel(req.body);
        await newPerson.save();
        return res.json(newPerson).status(200);
    }

    fetchOneAndUpdate = async (req: Request, res: Response): Promise<Response<Person | null>> => {
        let person: Person | null = await PersonModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        return res.json(person).status(200);
    }
    
    fetchOneAndDelete = async (req: Request, res: Response): Promise<Response<Person | null>> => {
        let person: Person | null = await PersonModel.findByIdAndDelete({ _id: req.params.id });
        return res.json(person).status(200);
    }
}

export const personalController: PersonController = new PersonController();
