import express from "express";
import { createDish, getDishes, getDishById, updateDish, deleteDish } from "../controllers/dishController.js";

const router = express.Router();

// Routes
router.post("/dishes", createDish);  // Create a dish
router.get("/dishes", getDishes);  // Get all dishes
router.get("/dishes/:id", getDishById);  // Get a specific dish
router.put("/dishes/:id", updateDish); // Update a dish
router.delete("/dishes/:id", deleteDish); // Delete a dish

export default router;