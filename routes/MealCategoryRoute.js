import express from "express";
import { 
    createMealCategory, 
    getAllMealCategories, 
    updateMealCategory, 
    deleteMealCategory 
} from "../controllers/mealCategoryController.js";

const router = express.Router();

// Create a new meal category
router.post("/category", createMealCategory);

// Get all meal categories
router.get("/category", getAllMealCategories);

// Update a meal category by ID
router.put("/category/:id", updateMealCategory);

// Delete a meal category by ID
router.delete("/category/:id", deleteMealCategory);

export default router;
