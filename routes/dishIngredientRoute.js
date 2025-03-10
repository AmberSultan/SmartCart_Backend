import express from "express";
import {
  upload,
  createIngredient,
  getIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
} from "../controllers/dishIngredientController.js";

const router = express.Router();

// Create a new ingredient
router.post("/ingredient", upload.single("image"), createIngredient);

// Get all ingredients
router.get("/ingredient", getIngredients);

// Get a specific ingredient by ID
router.get("/ingredient/:id", getIngredientById);

// Update an ingredient by ID
router.put("/ingredient/:id", upload.single("image"), updateIngredient);

// Delete an ingredient by ID
router.delete("/ingredient/:id", deleteIngredient);

export default router;
