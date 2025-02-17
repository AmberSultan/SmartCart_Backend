import mongoose, { Schema } from "mongoose";

// MealCategory Schema
const mealCategorySchema = new Schema(
    {
        categoryName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    { timestamps: true }
);

// Export the MealCategory model
export default mongoose.model("MealCategory", mealCategorySchema);
