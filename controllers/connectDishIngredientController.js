import ConnectDishIngredient from '../models/connectDishIngredientModel.js';

// Create a new dish ingredient relationship
export const createDishIngredient = async (req, res) => {
  try {
    const { dishId, ingredients } = req.body;

    if (!dishId || !ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: "Invalid data format." });
    }

    const ingredientEntries = ingredients.map((ingredient) => ({
      dishId,
      ingredientId: ingredient.ingredientId,
      quantity: ingredient.quantity,
    }));

    const createdIngredients = await ConnectDishIngredient.insertMany(ingredientEntries);

    res.status(201).json({
      message: "Ingredients added successfully to the dish.",
      data: createdIngredients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating dish ingredient",
      error,
    });
  }
};


// Get all dish ingredient relationships
export const getDishIngredients = async (req, res) => {
  try {
    const dishIngredients = await ConnectDishIngredient.find()
      .populate('dishId', 'dishName') // Populate dish details
      .populate('ingredientId', 'ingredientName'); // Populate ingredient details

    res.status(200).json(dishIngredients);
  } catch (error) {
    console.error('Error fetching dish ingredients:', error);
    res.status(500).json({ message: 'Error fetching dish ingredients', error });
  }
};

// Get a dish ingredient relationship by ID
export const getDishIngredientById = async (req, res) => {
  try {
    const { id } = req.params;

    const dishIngredient = await ConnectDishIngredient.findById(id)
      .populate('dishId', 'dishName') // Populate dish details
      .populate('ingredientId', 'ingredientName'); // Populate ingredient details

    if (!dishIngredient) {
      return res.status(404).json({ message: 'Dish Ingredient not found' });
    }

    res.status(200).json(dishIngredient);
  } catch (error) {
    console.error('Error fetching dish ingredient:', error);
    res.status(500).json({ message: 'Error fetching dish ingredient', error });
  }
};

// Update a dish ingredient relationship
export const updateDishIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { dishId, ingredientId, quantity } = req.body;

    const updatedDishIngredient = await ConnectDishIngredient.findByIdAndUpdate(
      id,
      { dishId, ingredientId, quantity },
      { new: true } // Return the updated object
    );

    if (!updatedDishIngredient) {
      return res.status(404).json({ message: 'Dish Ingredient not found' });
    }

    res.status(200).json({
      message: 'Dish Ingredient updated successfully',
      dishIngredient: updatedDishIngredient,
    });
  } catch (error) {
    console.error('Error updating dish ingredient:', error);
    res.status(500).json({ message: 'Error updating dish ingredient', error });
  }
};

// Delete a dish ingredient relationship
export const deleteDishIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDishIngredient = await ConnectDishIngredient.findByIdAndDelete(id);

    if (!deletedDishIngredient) {
      return res.status(404).json({ message: 'Dish Ingredient not found' });
    }

    res.status(200).json({
      message: 'Dish Ingredient deleted successfully',
      dishIngredient: deletedDishIngredient,
    });
  } catch (error) {
    console.error('Error deleting dish ingredient:', error);
    res.status(500).json({ message: 'Error deleting dish ingredient', error });
  }
};
