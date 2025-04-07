import express from "express";
import { addToCart, getCart, removeFromCart} from "../controllers/cartController.js";

const router = express.Router();

// Route to add item to cart (POST)
router.post("/yourcart/:userId", addToCart);

// Route to get all items in the user's cart (GET)
router.get("/yourcart/:userId", getCart);

// Route to update an item in the user's cart (PUT)
// router.put("/yourcart/:userId/:cartId", updateCart);

// Route to clear the user's entire cart (DELETE)
router.delete("/yourcart/:userId/:cartId", removeFromCart);

export default router;
