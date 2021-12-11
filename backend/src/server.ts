import { Request, Response } from "express";

const express = require("express");
// Routes
const pictureRoutes = require("./routes/picture");
const skillsRoutes = require("./routes/skills");

const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 1024 * 1024 * 1024, //1 MB max file(s) size
    },
  })
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use("/pictures", pictureRoutes);
app.use("/skills", skillsRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send({ msg: "huinya" });
});

app.listen(3000, () => {
  console.log("server started");
});
