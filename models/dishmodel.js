import mongoose, { Schema } from "mongoose";

const dishSchema = new Schema(
  {
    dishName: {
      type: String,
      required: true,
      unique: true, 
    },
    dishImg: {
      type: String,
      required: true, 
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "MealCategory",
      required: true,
    },
  },
  { timestamps: true } 
);

export default mongoose.model("Dish", dishSchema);
