import { LikeRepository } from "./like.repository.js";

export class LikeController {
  constructor() {
    this.likeRepo = new LikeRepository();
  }

  async getLikes(req, res, next) {
    try {
      const { id, type } = req.query;
      const likes = await this.likeRepo.getLikes(type, id);
      return res.status(200).send(likes);
    } catch (err) {
      console.log(err);
      return res.status(400).send("Something went wrong");
    }
  }
  async likeItem(req, res, next) {
    try {
      const { id, type } = req.body;
      const userId = req.userId;
      if (type != "Product" && type != "Category") {
        return res.status(400).send("invalid Type");
      }

      if (type == "Product") {
        this.likeRepo.likeProduct(userId, id);
      } else {
        this.likeRepo.likeCategory(userId, id);
      }
      return res.status(200).send();
    } catch (err) {
      console.log(err);
      return res.status(400).send("Something went wrong");
    }
  }
}
