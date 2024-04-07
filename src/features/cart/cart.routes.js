import express from "express";
import CartController from "./cart.controller.js";

const router = express.Router();

const cartController = new CartController();

router.post("/", (req, res) => {
  cartController.addToCart(req, res);
});
router.get("/", (req, res) => {
  cartController.getAllCartItems(req, res);
});
router.delete("/:cartItemId", (req, res) => {
  cartController.deleteCartItem(req, res);
});
export default router;
