import { Request, Response } from "express";
import { Connection } from "typeorm";
import { connection } from "../db/connection";
import { PictureRepository } from "../repository/PictureRepository";
import { getRepository } from "typeorm";
import { Picture } from "../entity/Picture";
import { body, validationResult } from "express-validator";
import { UPLOADS } from "../constants/paths";
import { IncomingPictureShape } from "../types/picture";

const express = require("express");
const router = express.Router();

interface RequestWithFiles extends Request {
  files: any;
  body: IncomingPictureShape;
}

connection.then((connection: Connection) => {
  const repository = getRepository(Picture);

  router.get("/", async (req: Request, res: Response) => {
    const picture = await repository.findOne({ id: "2" });
    res.send({ msg: picture });
  });

  router.post(
    "/",
    body("name").isLength({
      min: 5,
      max: 100,
    }),
    body("is_main").isBoolean().withMessage("Must be of type boolean"),
    // body("picture").notEmpty(), // FIXME
    async (req: RequestWithFiles, res: Response) => {
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
        const picturePath = UPLOADS + "/" + incomingPicture.name;
        incomingPicture.mv(picturePath);

        const picture = repository.create();

        picture.name = req.body.name;
        picture.path = picturePath;
        picture.is_main = req.body.is_main;
        await repository.save(picture);
        const currentMainPicture = await repository.findOne({ is_main: true });

        return res.send({
          success: true,
          message: "Picture saved",
        });
      } catch (error) {
        return res.status(500).send(error);
      }
    }
  );

  router.put("/", (req: Request, res: Response) => {
    console.log(req);
    res.send({ msg: "put" });
  });

  router.delete("/", (req: Request, res: Response) => {
    console.log(req);
    res.send({ msg: "delete" });
  });
});

module.exports = router;
