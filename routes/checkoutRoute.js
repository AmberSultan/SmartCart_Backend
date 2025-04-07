import express from 'express';
import {
  createCheckout,
  getUserCheckouts,
  getCheckoutById,
  getAllCheckouts,
  updateCheckout,
  deleteCheckout,
} from '../controllers/checkoutController.js';

const router = express.Router();

// Create a new checkout order
router.post('/checkout', createCheckout);

// Get all checkout orders (for admin)
router.get('/checkout', getAllCheckouts);

// Get all checkout orders for a specific user
router.get('/checkout/:userId', getUserCheckouts); // Add this line

// Get a single checkout order by ID
router.get('/checkout/order/:checkoutId', getCheckoutById);

// Update a checkout order
router.put('/checkout/:checkoutId', updateCheckout);

// Delete a checkout order
router.delete('/checkout/:checkoutId', deleteCheckout);

export default router;