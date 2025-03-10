import mongoose from 'mongoose';

const connectDishIngredientSchema = new mongoose.Schema(
  {
    dish: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: [
      {
        ingredient: {
          type: String,
          required: true,
          trim: true,
        },
        quantity: {
          type: String,
          required: true,
          trim: true,
        },
        unit: {
          type: String,
          required: true,
          trim: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ConnectDishIngredient = mongoose.model('ConnectDishIngredient', connectDishIngredientSchema);

export default ConnectDishIngredient;
