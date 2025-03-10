import mongoose, { Schema } from "mongoose";

const dishIngredientSchema = new Schema(
  {
    ingredientName: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: String, 
      required: true,
    },
    ingredientImg: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DishIngredient", dishIngredientSchema);
