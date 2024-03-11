import { ObjectId } from "mongodb";

export interface Comment {
    _id: ObjectId;
    name: string;
    text: string;
    date: Date;
    cakeId: ObjectId | string;
    sentiment?: any;
}
