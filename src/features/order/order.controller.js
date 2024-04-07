import OrderRepository from "./order.repository.js";

export default class OrderController {
  constructor() {
    this.orderRepo = new OrderRepository();
  }

  async placeOrder(req, res, next) {
    try {
      const userId = req.userId;
      await this.orderRepo.placeOrder(userId);
      res.status(201).send("Order has been Created");
    } catch (err) {
      console.log(err);
      return res.status(400).send("Something went wrong");
    }
  }
}
