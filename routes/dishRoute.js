import express from "express";
import multer from "multer"; // For handling file uploads
import { createDish, getDishes, getDishById, updateDish, deleteDish } from "../controllers/dishController.js";

const router = express.Router();

// Use the multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save images to 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Save the file with its original name, ensuring no overwriting
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
router.post("/createdish", upload.single("image"), createDish);  // For creating a dish
router.get("/getdishes", getDishes);  // For getting all dishes
router.get("/getdishes/:id", getDishById); 
router.put("/updatedishes/:id", upload.single("image"), updateDish); // Update dish
router.delete("/deletedishes/:id", deleteDish); // Delete dish

export default router;
