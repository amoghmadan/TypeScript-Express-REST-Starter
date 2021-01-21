import { model, Model, Schema } from "mongoose";
import { Person } from "../interfaces/models";

const PersonSchema: Schema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true }
});

export const PersonModel: Model<Person> = model<Person>("Person", PersonSchema);
