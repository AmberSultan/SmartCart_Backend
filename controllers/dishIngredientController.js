import DishIngredient from "../models/dishIngredient.js";
import multer from "multer";
import path from "path";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Ensure unique file names
  },
});

export const upload = multer({ storage });

// Create a new dish ingredient
export const createIngredient = async (req, res) => {
  try {
    console.log(req.body); // log form data
    console.log(req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const { ingredientName, price, quantity } = req.body;
    const imagePath = path.join('uploads', req.file.filename); // Save image path

    const newIngredient = new DishIngredient({
      ingredientName,
      price,
      quantity,
      ingredientImg: imagePath,
    });

    const savedIngredient = await newIngredient.save();
    res.status(201).json({
      message: "Ingredient created successfully",
      ingredient: savedIngredient,
    });
  } catch (error) {
    console.error("Error creating ingredient:", error);
    res.status(500).json({ message: "Error creating ingredient", error });
  }
};

// Get all dish ingredients
export const getIngredients = async (req, res) => {
  try {
    const ingredients = await DishIngredient.find();
    res.status(200).json(ingredients);
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    res.status(500).json({ message: "Error fetching ingredients", error });
  }
};

// Get an ingredient by ID
export const getIngredientById = async (req, res) => {
  try {
    const ingredient = await DishIngredient.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ message: "Ingredient not found" });
    res.status(200).json(ingredient);
  } catch (error) {
    console.error("Error fetching ingredient:", error);
    res.status(500).json({ message: "Error fetching ingredient", error });
  }
};

// Update an ingredient
export const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredientName, price, quantity } = req.body;

    let updateData = { ingredientName, price, quantity };

    // Check if a new image is uploaded
    if (req.file) {
      const imagePath = path.join('uploads', req.file.filename);
      updateData.ingredientImg = imagePath; // Update image path
    }

    const updatedIngredient = await DishIngredient.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedIngredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.status(200).json({
      message: "Ingredient updated successfully",
      ingredient: updatedIngredient,
    });
  } catch (error) {
    console.error("Error updating ingredient:", error);
    res.status(500).json({ message: "Error updating ingredient", error });
  }
};

// Delete an ingredient
export const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIngredient = await DishIngredient.findByIdAndDelete(id);

    if (!deletedIngredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.status(200).json({
      message: "Ingredient deleted successfully",
      ingredient: deletedIngredient,
    });
  } catch (error) {
    console.error("Error deleting ingredient:", error);
    res.status(500).json({ message: "Error deleting ingredient", error });
  }
};
