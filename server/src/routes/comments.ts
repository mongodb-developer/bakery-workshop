import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";

export const commentRouter = express.Router();
commentRouter.use(express.json());

commentRouter.get("/", async (_req, res) => {
    try {
        const comments = await collections?.comments?.find({}).toArray();
        res.status(200).send(comments);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

commentRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const comment = await collections?.comments?.findOne(query);

        if (comment) {
            res.status(200).send(comment);
        } else {
            res.status(404).send(`Failed to find an comment: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find an comment: ID ${req?.params?.id}`);
    }
});

commentRouter.post("/", async (req, res) => {
    try {
        const comment = req.body;
        comment.cakeId = new ObjectId((<string>comment.cakeId));
        const result = await collections?.comments?.insertOne(comment);

        if (result?.acknowledged) {
            res.status(200).send(result);
        } else {
            res.status(500).send("Failed to create a new comment.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

commentRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const comment = req.body;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.comments?.updateOne(query, { $set: comment });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an comment: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find an comment: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an comment: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

commentRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.comments?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an comment: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an comment: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an comment: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});
