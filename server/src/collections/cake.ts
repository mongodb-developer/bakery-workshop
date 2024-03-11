import { ObjectId } from "mongodb";

export interface Cake {
    _id: ObjectId;
    cakeId: ObjectId;
    name: string;
    shortDescription: string;
    description: string;
    image: string;
    ingredients: Array<string>;
    recipe: string;
    stock: number;
}
