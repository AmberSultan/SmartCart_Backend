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

router.post("/createdishingredient", upload.single("image"), createIngredient);
router.get("/alldishingredient", getIngredients);
router.get("/getdishingredient/:id", getIngredientById);
router.put("/updatedishingredient/:id", upload.single("image"), updateIngredient);
router.delete("/delete/dishingredient/:id", deleteIngredient);

export default router;
