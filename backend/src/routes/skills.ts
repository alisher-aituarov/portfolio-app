import { Request, response, Response } from "express";
import { Connection, Not } from "typeorm";
import { connection } from "../db/connection";
import { getRepository } from "typeorm";
import { body, validationResult } from "express-validator";
import { Skill } from "../entity/Skills";

const express = require("express");
const router = express.Router();

interface PostRequest extends Request {}

connection.then((connection: Connection) => {
  const repository = getRepository(Skill);

  router.get("/", async (req: PostRequest, res: Response) => {
    const skills = repository.find();
    res.json({
      data: skills,
    });
  });

  router.post(
    "/",
    body("name").isLength({
      min: 3,
      max: 100,
    }),
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
    body("level").isFloat({
      min: 1,
      max: 10,
    }),
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: errors.array(),
        });
      }
      const skill = repository.create(req.body);

      try {
        await repository.save(skill);
        res.send({
          success: true,
          msg: "Skill have been saved",
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
    body("name")
      .isLength({
        min: 3,
        max: 100,
      })
      .optional(),
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
    body("level")
      .isFloat({
        min: 1,
        max: 10,
      })
      .optional(),
    async (req: Request, res: Response) => {
      const entityID = req.params.id;
      const newSkills = req.body;
      const skill = repository.findOne({ id: entityID });
      if (!skill) {
        res.status(404).json({
          success: false,
          msg: "Entity not found",
        });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: errors.array(),
        });
      }
      try {
        await repository.update(entityID, newSkills);
        res.send({
          success: true,
          msg: "Skill have been updated",
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
        msg: "Skill have been deleted",
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
