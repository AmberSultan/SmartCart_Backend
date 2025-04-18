import express from 'express';
import {
  createDishIngredient,
  getDishIngredients,
  getDishIngredientById,
  updateDishIngredient,
  deleteDishIngredient,
} from '../controllers/connectDishIngredientController.js';

const router = express.Router();

router.post('/dish-ingredient', createDishIngredient); // Create a new dish ingredient relationship
router.get('/dish-ingredient', getDishIngredients); // Get all dish ingredient relationships
router.get('/dish-ingredient/:id', getDishIngredientById); // Get a dish ingredient relationship by ID
router.put('/dish-ingredient/:id', updateDishIngredient); // Update a dish ingredient relationship
router.delete('/dish-ingredient/:id', deleteDishIngredient); // Delete a dish ingredient relationship

export default router;
