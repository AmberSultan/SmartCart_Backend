import mongoose from 'mongoose';

const connectDishIngredientSchema = new mongoose.Schema(
  {
    dishId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish', // Reference to the Dish model
      required: true,
    },
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DishIngredient', // Reference to the DishIngredient model
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // To track creation and modification times
  }
);

const ConnectDishIngredient = mongoose.model('ConnectDishIngredient', connectDishIngredientSchema);

export default ConnectDishIngredient;
