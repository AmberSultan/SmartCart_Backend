import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dishId: {
      type: Schema.Types.ObjectId,
      ref: "Dish",
      required: true,
    },
    dishName: { // Added dishName field
      type: String,
      required: false, // Optional, as dishId is still the primary key
    },
    selectedIngredients: {
      type: [{
        ingredientId: {
          type: Schema.Types.ObjectId,
          ref: "DishIngredient",
          required: true,
        },
        ingredientName: { // Added ingredientName field
          type: String,
          required: false, // Optional, as ingredientId is still the primary key
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      }],
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);