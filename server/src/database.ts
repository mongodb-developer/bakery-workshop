import * as mongodb from "mongodb";
import { Cake } from "./collections/cake";

export const collections: {
    cakes?: mongodb.Collection<Cake>;
    comments?: mongodb.Collection<Comment>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri, { appName: 'devrel.googlecloud.getting-started-lab' });
    await client.connect();

    const db = client.db("Bakery");

    const cakesCollection = db.collection<Cake>("cakes");
    collections.cakes = cakesCollection;

    const commentsCollection = db.collection<Comment>("comments");
    collections.comments = commentsCollection;
}
