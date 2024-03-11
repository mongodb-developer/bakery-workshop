import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";

export const cakeRouter = express.Router();
cakeRouter.use(express.json());

cakeRouter.get("/", async (_req, res) => {
    try {
        const cakes = await collections?.cakes?.find({}).toArray();
        res.status(200).send(cakes);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

cakeRouter.get("/comments/:id", async (req, res) => {
    try {
        const cakeId = req?.params?.id;
        const comments = await collections?.comments?.find(
            {
                cakeId: new ObjectId(cakeId)
            }
        ).toArray();

        if (comments) {
            res.status(200).send(comments);
        } else {
            res.status(404).send(`Failed to find an cake: ID ${cakeId}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find an cake: ID ${req?.params?.id}`);
    }
});

cakeRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const cake = await collections?.cakes?.findOne(query);

        if (cake) {
            res.status(200).send(cake);
        } else {
            res.status(404).send(`Failed to find an cake: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find an cake: ID ${req?.params?.id}`);
    }
});

cakeRouter.post("/", async (req, res) => {
    try {
        const cake = req.body;
        const result = await collections?.cakes?.insertOne(cake);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new cake: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new cake.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

cakeRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const cake = req.body;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.cakes?.updateOne(query, { $set: cake });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an cake: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find an cake: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an cake: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

cakeRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.cakes?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an cake: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an cake: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an cake: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});
