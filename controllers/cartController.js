import Cart from "../models/cartModel.js";
import ConnectDishIngredient from "../models/connectDishIngredientModel.js";
import DishIngredient from "../models/dishIngredient.js";
import mongoose from "mongoose";

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const { userId, dishId, dishName, selectedIngredients, totalCost } = req.body;

    // Validate required fields
    if (!userId || !dishId || !Array.isArray(selectedIngredients) || totalCost == null) {
      return res.status(400).json({ message: "Missing or invalid required fields" });
    }

    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(dishId)) {
      return res.status(400).json({ message: "Invalid userId or dishId format" });
    }

    // Validate ingredient IDs and optionally log names
    for (const ingredient of selectedIngredients) {
      if (!mongoose.Types.ObjectId.isValid(ingredient.ingredientId)) {
        return res.status(400).json({ message: `Invalid ingredientId: ${ingredient.ingredientId}` });
      }
      // Optional: Add validation for ingredientName if you want to enforce a format
      if (ingredient.ingredientName && typeof ingredient.ingredientName !== "string") {
        return res.status(400).json({ message: `Invalid ingredientName: ${ingredient.ingredientName}` });
      }
    }

    // Create and save cart item
    const cartItem = new Cart({
      userId,
      dishId,
      dishName, // Include dishName from request body
      selectedIngredients: selectedIngredients.map(ingredient => ({
        ingredientId: ingredient.ingredientId,
        ingredientName: ingredient.ingredientName, // Include ingredientName from request body
        quantity: ingredient.quantity,
        price: ingredient.price,
      })),
      totalCost,
    });

    await cartItem.save();

    res.status(201).json({ message: "Cart updated successfully!", cartItem });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get TO CART
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params; // Check if userId comes from params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Fetch the user's cart and populate references
    const cart = await Cart.find({ userId })
      .populate("dishId", "name") // Optionally populate dish name from Dish collection
      .populate("selectedIngredients.ingredientId", "ingredient"); // Optionally populate ingredient name from DishIngredient collection

    // Log the populated cart to debug
    console.log("Populated Cart:", JSON.stringify(cart, null, 2));

    if (!cart.length) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    // Map the cart to include names explicitly in the response
    const formattedCart = cart.map(item => ({
      _id: item._id,
      userId: item.userId,
      dishId: item.dishId,
      dishName: item.dishName || (item.dishId?.name ?? "Unknown Dish"), // Use stored dishName or fallback to populated name
      selectedIngredients: item.selectedIngredients.map(ing => ({
        ingredientId: ing.ingredientId,
        ingredientName: ing.ingredientName || (ing.ingredientId?.ingredient ?? "Unknown Ingredient"), // Use stored ingredientName or fallback
        quantity: ing.quantity,
        price: ing.price,
      })),
      totalCost: item.totalCost,
    }));

    // Calculate total cost
    const totalCost = cart.reduce((acc, item) => acc + item.totalCost, 0);

    // Return response
    res.status(200).json({ cart: formattedCart, totalCost });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Remove Item
export const removeFromCart = async (req, res) => {
  try {
    const { userId, cartId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid cartId or userId format" });
    }

    const cart = await Cart.findOneAndDelete({ _id: cartId, userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Item removed successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear Cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const result = await Cart.deleteMany({ userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No items found to clear" });
    }

    res.status(200).json({ message: "Cart cleared successfully", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};