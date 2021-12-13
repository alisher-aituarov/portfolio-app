import { Request, response, Response } from "express";
import { body, validationResult } from "express-validator";
import { Connection, getRepository } from "typeorm";
import { cvExtensions } from "../constants/allowedExtensions";
import { UPLOADS } from "../constants/paths";
import { connection } from "../db/connection";
import { CV } from "../entity/CV";

const express = require("express");
const router = express.Router();
const fs = require("fs");

interface RequestWithDocument extends Request {
  files: any;
}

connection.then((connection: Connection) => {
  const repository = getRepository(CV);
  router.get("/", async (req: Request, res: Response) => {
    const cvs = await repository.find();
    res.json({ data: cvs });
  });

  router.post(
    "/",
    body("name").isLength({
      min: 5,
      max: 100,
    }),
    // body("document").notEmpty(),
    async (req: RequestWithDocument, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: errors.array(),
        });
      }
      const { body } = req;
      const document = req.files.document;
      const fileExt = document.name.split(".").pop();
      if (!cvExtensions.includes(fileExt)) {
        res.status(400).json({
          success: false,
          error:
            "File extension is not allowed. Only " +
            cvExtensions.toString() +
            " can be passed",
        });
      }
      const documentPath = UPLOADS + "/" + document.name.split(" ").join("_");
      document.mv(documentPath);

      const cv = repository.create({ ...body, path: documentPath });
      try {
        await repository.save(cv);
        res.json({
          success: true,
          msg: "CV has been successfully saved",
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error,
        });
      }
    }
  );

  router.put("/:id", async (req: RequestWithDocument, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const cv = await repository.findOne({ id });

    if (!cv) {
      res.status(404).json({
        success: false,
        error: "Entity is not found",
      });
    }

    const document = req.files.document;
    let documentPath;
    if (document) {
      const fileExt = document.name.split(".").pop();
      if (!cvExtensions.includes(fileExt)) {
        res.status(400).json({
          success: false,
          error:
            "File extension is not allowed. Only " +
            cvExtensions.toString() +
            " can be passed",
        });
      } else {
        documentPath = UPLOADS + "/" + document.name.split(" ").join("_");
        document.mv(documentPath);
        body.path = documentPath;
      }
    }

    try {
      await repository.update(id, body);
      if (documentPath) {
        fs.unlinkSync(cv?.path);
      }
      res.json({
        success: true,
        msg: "CV has been updated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error,
      });
    }
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const cv = await repository.findOne({ id });
      if (!cv) {
        res.status(404).json({
          success: false,
          error: "CV is not found",
        });
      }
      await repository.delete({ id });
      fs.unlinkSync(cv?.path);
      res.json({
        success: true,
        msg: "CV has been deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error,
      });
    }
  });
});

module.exports = router;
