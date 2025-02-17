import Cart from "../models/cartModel.js";
import Dish from "../models/dishmodel.js";
import DishIngredient from "../models/dishIngredient.js"; // Import the correct model

export const addToCart = async (req, res) => {
  try {
    const { userId, dishId, selectedIngredients } = req.body;

    // Find dish to get ingredient info
    const dish = await Dish.findById(dishId).populate("categoryId");
    if (!dish) return res.status(404).json({ message: "Dish not found" });

    // Calculate the total cost of selected ingredients
    let totalCost = 0;
    for (const ingredient of selectedIngredients) {
      const { ingredientId, quantity } = ingredient;
      const ingredientDetails = await DishIngredient.findById(ingredientId); // Use DishIngredient model
      if (!ingredientDetails) {
        return res.status(404).json({ message: `Ingredient with ID ${ingredientId} not found` });
      }
      totalCost += ingredientDetails.price * quantity; // Calculate price * quantity
    }

    // Create or update the cart
    const existingCart = await Cart.findOne({ userId, dishId });
    if (existingCart) {
      // Update the cart with new ingredients and total cost
      existingCart.selectedIngredients = selectedIngredients;
      existingCart.totalCost = totalCost;
      await existingCart.save();
      return res.status(200).json({ message: "Cart updated", cart: existingCart });
    }

    // Create a new cart entry
    const newCart = new Cart({
      userId,
      dishId,
      selectedIngredients,
      totalCost,
    });
    await newCart.save();

    res.status(201).json({ message: "Dish added to cart", cart: newCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get the user's cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.find({ userId }).populate("selectedIngredients.ingredientId");
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
    const cart = await Cart.findOneAndDelete({ _id: cartId, userId });
    if (!cart) return res.status(404).json({ message: "Cart item not found" });
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
