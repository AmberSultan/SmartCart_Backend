import Cart from "../models/cartModel.js";
import ConnectDishIngredient from "../models/connectDishIngredientModel.js";
import DishIngredient from "../models/dishIngredient.js";
import mongoose from "mongoose";

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const { userId, dishId, selectedIngredients, totalCost } = req.body;

    // Validate required fields
    if (!userId || !dishId || !Array.isArray(selectedIngredients) || totalCost == null) {
      return res.status(400).json({ message: "Missing or invalid required fields" });
    }

    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(dishId)) {
      return res.status(400).json({ message: "Invalid userId or dishId format" });
    }

    // Validate ingredient IDs
    for (const ingredient of selectedIngredients) {
      if (!mongoose.Types.ObjectId.isValid(ingredient.ingredientId)) {
        return res.status(400).json({ message: `Invalid ingredientId: ${ingredient.ingredientId}` });
      }
    }

    // Create and save cart item
    const cartItem = new Cart({
      userId,
      dishId,
      selectedIngredients,
      totalCost,
    });

    await cartItem.save();

    res.status(201).json({ message: "Cart updated successfully!", cartItem });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Get Cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }
    const cart = await Cart.find({ userId }).populate("dishId").populate("selectedIngredients.ingredientId");
    if (!cart.length) return res.status(404).json({ message: "Cart is empty" });
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Item
export const removeFromCart = async (req, res) => {
  try {
    const { userId, cartId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: "Invalid cartId format" });
    }
    const cart = await Cart.findOneAndDelete({ _id: cartId, userId });
    if (!cart) return res.status(404).json({ message: "Cart item not found" });
    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear Cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.deleteMany({ userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};