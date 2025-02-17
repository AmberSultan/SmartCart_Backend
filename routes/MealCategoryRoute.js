import express from "express";
import { createMealCategory, getAllMealCategories, updateMealCategory, deleteMealCategory } from "../controllers/mealCategoryController.js";

const router = express.Router();

// Route to create a new meal category
router.post("/createcategory", createMealCategory);

// Route to get all meal categories
router.get("/allcategory", getAllMealCategories);

// Route to update a meal category by ID
router.put("/updatecategory/:id", updateMealCategory);

// Route to delete a meal category by ID
router.delete("/deletecategory/:id", deleteMealCategory);

export default router;
