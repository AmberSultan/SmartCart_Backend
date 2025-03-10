import Cart from "../models/cartModel.js";
import ConnectDishIngredient from "../models/connectDishIngredientModel.js";
import DishIngredient from "../models/dishIngredient.js";
import mongoose from "mongoose";

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, dishId, dishName, selectedIngredients, totalCost } = req.body;

    // Validate required fields
    if (!userId || !dishId || !dishName || !selectedIngredients || !Array.isArray(selectedIngredients)) {
      return res.status(400).json({ message: "Missing or invalid required fields" });
    }

    // Convert dishId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(dishId)) {
      return res.status(400).json({ message: "Invalid dishId format" });
    }
    const dishObjectId = new mongoose.Types.ObjectId(dishId);

    // Find dish-ingredient connections for the dish
    const dishIngredients = await ConnectDishIngredient.find({ dish: dishId });
    console.log("Dish Ingredients:", dishIngredients); // Debugging: Check the retrieved data

    if (!dishIngredients || dishIngredients.length === 0) {
      return res.status(404).json({ message: "No ingredients found for this dish" });
    }

    // Create a map for quick lookup of ConnectDishIngredient by ingredient ID
    const connectDishIngredientMap = new Map();
    dishIngredients.forEach((conn) => {
      connectDishIngredientMap.set(conn.ingredient.toString(), conn);
    });

    // Extract all ingredient IDs from selectedIngredients
    const ingredientIds = selectedIngredients.map((ing) => new mongoose.Types.ObjectId(ing.ingredientId));

    // Fetch all ingredients in a single query
    const ingredients = await DishIngredient.find({ _id: { $in: ingredientIds } });

    // Create a map for quick lookup of DishIngredient by ID
    const ingredientMap = new Map();
    ingredients.forEach((ing) => ingredientMap.set(ing._id.toString(), ing));

    // Calculate total cost and validate ingredients
    let calculatedTotalCost = 0;
    const convertedIngredients = [];

    for (const ingredient of selectedIngredients) {
      const { ingredientId, quantity } = ingredient;

      // Get the ConnectDishIngredient entry
      const connectDishIngredient = connectDishIngredientMap.get(ingredientId);
      if (!connectDishIngredient) {
        return res.status(404).json({ message: `Ingredient with ID ${ingredientId} not found in dish-ingredient connections` });
      }

      // Get the DishIngredient details
      const ingredientDetails = ingredientMap.get(ingredientId);
      if (!ingredientDetails) {
        return res.status(404).json({ message: `Ingredient with ID ${ingredientId} not found` });
      }

      // Calculate the cost using the price from ConnectDishIngredient
      calculatedTotalCost += connectDishIngredient.price * quantity;
      convertedIngredients.push({
        connectDishIngredientId: connectDishIngredient._id, // Use ConnectDishIngredient ID
        ingredientId: ingredientDetails._id,
        quantity,
        price: connectDishIngredient.price,
      });
    }

    // Check if the calculated total cost matches the provided totalCost
    if (calculatedTotalCost !== totalCost) {
      return res.status(400).json({ message: "Total cost mismatch" });
    }

    // Check if cart entry exists
    const existingCart = await Cart.findOneAndUpdate(
      { userId, dishId: dishObjectId },
      { dishName, selectedIngredients: convertedIngredients, totalCost },
      { new: true } // Return the updated document
    );

    if (existingCart) {
      return res.status(200).json({ message: "Cart updated", cart: existingCart });
    }

    // Create new cart entry
    const newCart = new Cart({
      userId,
      dishId: dishObjectId,
      dishName,
      selectedIngredients: convertedIngredients,
      totalCost,
    });

    await newCart.save();
    res.status(201).json({ message: "Dish added to cart", cart: newCart });
  } catch (error) {
    console.error("Error in addToCart:", error); // Debugging: Log the full error
    res.status(500).json({ message: error.message });
  }
};

// Get the user's cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const cart = await Cart.find({ userId })
      .populate("dishId")
      .populate("selectedIngredients.ingredientId");

    if (!cart || cart.length === 0) return res.status(404).json({ message: "Cart is empty" });
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, cartId } = req.params;

    // Validate cartId
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: "Invalid cartId format" });
    }

    const cart = await Cart.findOneAndDelete({ _id: cartId, userId });
    if (!cart) return res.status(404).json({ message: "Cart item not found" });
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear the user's cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Delete all cart items for the user
    await Cart.deleteMany({ userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};