import { Request, Response } from "express";
import { Connection, Not } from "typeorm";
import { connection } from "../db/connection";
import { getRepository } from "typeorm";
import { body, validationResult } from "express-validator";
import { Contact } from "../entity/Contact";
import { UPLOADS } from "../constants/paths";
import { contactIconExtensions } from "../constants/allowedExtensions";

const express = require("express");
const router = express.Router();
const fs = require("fs");

interface RequestWithDocument extends Request {
  files: any;
}

connection.then((connection: Connection) => {
  const repository = getRepository(Contact);

  router.get("/", async (req: Request, res: Response) => {
    const contacts = await repository.find();
    res.json({
      data: contacts,
    });
  });

  router.post(
    "/",
    body("name").isLength({
      min: 3,
      max: 20,
    }),
    body("link").isString(),

    async (req: RequestWithDocument, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: errors.array(),
        });
      }

      const icon = req.files.icon;
      if (!icon) {
        res.status(400).json({
          success: false,
          error: "Icon is required",
        });
      }
      const fileExt = icon.name.split(".").pop();
      if (!contactIconExtensions.includes(fileExt)) {
        res.status(400).json({
          success: false,
          error:
            "File extension is not allowed. Only " +
            contactIconExtensions.toString() +
            " can be passed",
        });
      }
      const iconPath = UPLOADS + "/" + icon.name.split(" ").join("_");
      icon.mv(iconPath);

      const contact = repository.create({ ...req.body, iconPath });

      try {
        await repository.save(contact);
        res.send({
          success: true,
          msg: "Contact has been saved",
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error,
        });
      }
    }
  );

  router.delete("/:id", async (req: Request, res: Response) => {
    const entityID = req.params.id;
    const contact = await repository.findOne({ id: entityID });
    if (!contact) {
      res.status(404).json({
        success: false,
        error: "Contact is not found",
      });
    }
    try {
      await repository.delete({ id: entityID });
      fs.unlinkSync(contact?.iconPath);
      res.send({
        success: true,
        msg: "Skill has been deleted",
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
