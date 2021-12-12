import { Request, Response } from "express";
import { Connection, getRepository } from "typeorm";
import { connection } from "../db/connection";
import { CV } from "../entity/CV";

const express = require("express");
const router = express.Router();

connection.then((connection: Connection) => {
  const repository = getRepository(CV);
  router.get("/", async (req: Request, res: Response) => {
    const cvs = await repository.find();
    res.send({ data: cvs });
  });
});

module.exports = router;
