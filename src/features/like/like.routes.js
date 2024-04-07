import express from "express";
import { LikeController } from "./like.controller.js";

export const Likerouter = express.Router();

const likeController = new LikeController();
Likerouter.post("/", (req, res) => {
  likeController.likeItem(req, res);
});

Likerouter.get("/", (req, res, next) => {
    likeController.getLikes(req, res, next);
  });
