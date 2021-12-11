import { Request, Response } from "express";
import { Connection, Not } from "typeorm";
import { connection } from "../db/connection";
import { PictureRepository } from "../repository/PictureRepository";
import { getRepository } from "typeorm";
import { Picture } from "../entity/Picture";
import { body, validationResult } from "express-validator";
import { UPLOADS } from "../constants/paths";
import { IncomingPictureShape, UpdatingPictureShape } from "../types/picture";

const express = require("express");
const fs = require("fs");
const router = express.Router();

interface TRequestWithFiles extends Request {
  files: any;
  body: IncomingPictureShape;
}

interface TRequestUpdate extends Request {
  files: any;
  body: UpdatingPictureShape;
}

interface TRequestDelete extends Request {
  body: {
    id: number;
  };
}

connection.then((connection: Connection) => {
  const repository = getRepository(Picture);

  router.get("/", async (req: Request, res: Response) => {
    const picture = await repository.findOne({ id: "2" });
    res.send({ data: picture });
  });

  router.post(
    "/",
    body("name").isLength({
      min: 5,
      max: 100,
    }),
    body("is_main").isBoolean().withMessage("Must be of type boolean"),
    // body("picture").notEmpty(), // FIXME
    async (req: TRequestWithFiles, res: Response) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            error: errors.array(),
          });
        }

        if (!req.files) {
          return res.status(400).json({
            success: false,
            error: "File must be uploaded",
          });
        }

        const incomingPicture = req.files.picture;
        const picturePath =
          UPLOADS + "/" + incomingPicture.name.split(" ").join("_");
        console.log(picturePath);
        incomingPicture.mv(picturePath);

        const picture = repository.create();

        picture.name = req.body.name;
        picture.path = picturePath;
        picture.is_main = req.body.is_main;
        await repository.save(picture);
        const currentMainPicture = await repository.findOne({ is_main: true });
        if (currentMainPicture) {
          currentMainPicture.is_main = false;
          repository.save(currentMainPicture);
        }
        return res.send({
          success: true,
          message: "Picture saved",
        });
      } catch (error) {
        return res.status(500).send(error);
      }
    }
  );

  router.put(
    "/",
    body("name")
      .isLength({
        min: 5,
        max: 100,
      })
      .optional(),
    body("is_main")
      .isBoolean()
      .withMessage("Must be of type boolean")
      .optional(),
    async (req: TRequestUpdate, res: Response) => {
      const { id, name, is_main } = req.body;
      const targetPicture = await repository.findOne({ is_main: true });
      if (!targetPicture) {
        return res.status(404).send({
          success: false,
          error: "Picture is not found",
        });
      }
      if (name) targetPicture.name = name;
      if (is_main) {
        targetPicture.is_main = is_main;
        if (targetPicture.is_main) {
          const currentActive = await repository.findOne({
            where: { id: Not(id), is_main: true },
          });
          if (currentActive) {
            currentActive.is_main = false;
            await repository.save(currentActive);
          }
        }
      } else {
        targetPicture.is_main = false;
      }

      const incomingPicture = req?.files?.picture;
      if (incomingPicture) {
        const picturePath =
          UPLOADS + "/" + incomingPicture.name.split(" ").join("_");
        incomingPicture.mv(picturePath);
        try {
          fs.unlinkSync(targetPicture.path);
          targetPicture.path = picturePath;
        } catch (error) {
          res.status(500).json({
            success: false,
            error,
          });
        }
      }
      console.log(targetPicture);
      await repository.save(targetPicture);
      return res.send({ success: true, message: "Picture updated" });
    }
  );

  router.delete("/", async (req: TRequestDelete, res: Response) => {
    try {
      await repository.delete(req.body.id);
      res.send({
        success: true,
        message: "Successfully deleted Picture " + req.body.id,
      });
    } catch (error) {
      res.send(500).json({
        success: false,
        error: error,
      });
    }
  });
});

module.exports = router;
