import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
const router = express.Router();

// Route to add item to cart
router.post("/createcart", addToCart);

// Route to get all items in the user's cart
router.get("/cart/:userId", getCart);

// Route to remove item from the user's cart
router.delete("/cart/:userId/:cartId", removeFromCart);

export default router;
