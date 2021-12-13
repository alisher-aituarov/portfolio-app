import { Request, response, Response } from "express";
import { Connection, Not } from "typeorm";
import { connection } from "../db/connection";
import { getRepository } from "typeorm";
import { body, validationResult } from "express-validator";
import { Experience } from "../entity/Experience";

const express = require("express");
const router = express.Router();

interface PostRequest extends Request {}

connection.then((connection: Connection) => {
  const repository = getRepository(Experience);

  router.get("/", async (req: Request, res: Response) => {
    const data = await repository.find();
    res.json({
      data,
    });
  });

  router.post(
    "/",
    body("position").isLength({ min: 5, max: 50 }),
    body("city").isLength({ min: 5, max: 100 }),
    body("company").isLength({ min: 5, max: 100 }),
    body("from").isDate(),
    body("to").isDate(),
    body("current").isBoolean(),
    body("description_ru").isLength({
      min: 10,
      max: 100,
    }),
    body("description_en").isLength({
      min: 10,
      max: 100,
    }),
    body("description_de").isLength({
      min: 10,
      max: 100,
    }),
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      const { body } = req;
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: errors.array(),
        });
      }
      const experience = repository.create(body);
      try {
        await repository.save(experience);
        res.send({
          success: true,
          msg: "Entity have been saved",
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error,
        });
      }
    }
  );

  router.put(
    "/:id",
    body("position").isLength({ min: 5, max: 50 }).optional(),
    body("city").isLength({ min: 5, max: 100 }).optional(),
    body("company").isLength({ min: 5, max: 100 }).optional(),
    body("from").isDate().optional(),
    body("to").isDate().optional(),
    body("current").isBoolean().optional(),
    body("description_ru")
      .isLength({
        min: 10,
        max: 100,
      })
      .optional(),
    body("description_en")
      .isLength({
        min: 10,
        max: 100,
      })
      .optional(),
    body("description_de")
      .isLength({
        min: 10,
        max: 100,
      })
      .optional(),
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      const entityID = req.params.id;
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: errors.array(),
        });
      }

      const entity = await repository.findOne({ id: entityID });
      if (!entity) {
        res.status(404).json({
          success: false,
          error: "Entity not found",
        });
      }

      const { body } = req;
      try {
        await repository.update(entityID, body);
        res.send({
          success: true,
          msg: "Entity has been updated",
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
    try {
      await repository.delete({ id: entityID });
      res.send({
        success: true,
        msg: "Entity has been deleted",
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
