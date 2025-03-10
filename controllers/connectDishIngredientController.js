import ConnectDishIngredient from '../models/connectDishIngredientModel.js';

// Create a new dish ingredient relationship
export const createDishIngredient = async (req, res) => {
  try {
    const { dish, ingredients } = req.body;

    // Validate the request body
    if (!dish || !ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: "Invalid data format." });
    }

    // Validate each ingredient
    for (const ingredient of ingredients) {
      if (!ingredient.ingredient || !ingredient.quantity || !ingredient.unit || !ingredient.price) {
        return res.status(400).json({ message: "All ingredient fields are required." });
      }
    }

    // Create a new dish-ingredient relationship
    const newDishIngredient = new ConnectDishIngredient({
      dish,
      ingredients,
    });

    // Save to the database
    const createdDishIngredient = await newDishIngredient.save();

    res.status(201).json({
      message: "Ingredients added successfully to the dish.",
      data: createdDishIngredient,
    });
  } catch (error) {
    console.error('Error creating dish ingredient:', error);
    res.status(500).json({ message: "Error creating dish ingredient" });
  }
};

// Get all dish ingredient relationships
export const getDishIngredients = async (req, res) => {
  try {
    const dishIngredients = await ConnectDishIngredient.find();

    // Check if any dish-ingredient relationships were found
    if (!dishIngredients || dishIngredients.length === 0) {
      return res.status(404).json({ message: 'No dish-ingredient relationships found' });
    }

    res.status(200).json(dishIngredients);
  } catch (error) {
    console.error('Error fetching dish ingredients:', error);
    res.status(500).json({ message: 'Error fetching dish-ingredient relationships' });
  }
};

// Get a dish ingredient relationship by ID
export const getDishIngredientById = async (req, res) => {
  try {
    const { id } = req.params;

    const dishIngredient = await ConnectDishIngredient.findById(id);

    if (!dishIngredient) {
      return res.status(404).json({ message: 'Dish Ingredient not found' });
    }

    res.status(200).json(dishIngredient);
  } catch (error) {
    console.error('Error fetching dish ingredient:', error);
    res.status(500).json({ message: 'Error fetching dish ingredient' });
  }
};

// Update a dish ingredient relationship
export const updateDishIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredients } = req.body;

    // Validate the request body
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: "Invalid data format." });
    }

    // Validate each ingredient
    for (const ingredient of ingredients) {
      if (!ingredient.ingredient || !ingredient.quantity || !ingredient.unit || !ingredient.price) {
        return res.status(400).json({ message: "All ingredient fields are required." });
      }
    }

    const updatedDishIngredient = await ConnectDishIngredient.findByIdAndUpdate(
      id,
      { ingredients },
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
    res.status(500).json({ message: 'Error updating dish ingredient' });
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
    res.status(500).json({ message: 'Error deleting dish ingredient' });
  }
};