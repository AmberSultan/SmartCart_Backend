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
    selectedIngredients: {
      type: [{
        ingredientId: {
          type: Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
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
