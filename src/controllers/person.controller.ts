import { Request, Response } from "express";
import { Person } from "../interfaces/models";
import { PersonModel } from "../models/person.model";

class PersonController {
    async fetchAll(req: Request, res: Response): Promise<void> {
        const people: Person[] = await PersonModel.find();
        res.status(200).json(people);
    }

    async fetchOne(req: Request, res: Response): Promise<void> {
        const person: Person | null = await PersonModel.findOne({ _id: req.params.id });
        res.status(200).json(person);
    }

    async createOne(req: Request, res: Response): Promise<void> {
        const newPerson: Person = new PersonModel(req.body);
        await newPerson.save();
        res.status(201).json(newPerson);
    }

    async fetchOneAndUpdate(req: Request, res: Response): Promise<void> {
        const person: Person | null = await PersonModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        res.status(200).json(person);
    }
    
    async fetchOneAndDelete(req: Request, res: Response): Promise<void> {
        const person: Person | null = await PersonModel.findByIdAndDelete({ _id: req.params.id });
        res.status(204).json(person);
    }
}

export const personalController: PersonController = new PersonController();
