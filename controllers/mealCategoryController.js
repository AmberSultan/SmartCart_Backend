import MealCategory from "../models/mealCategorymodel.js";

// Create a new meal category
export const createMealCategory = async (req, res) => {
    const { categoryName } = req.body;

    try {
        // Check if the category already exists
        const existingCategory = await MealCategory.findOne({ categoryName });
        if (existingCategory) {
            return res.status(409).json({ error: "Category already exists" });
        }

        // Create and save the new meal category
        const newCategory = new MealCategory({ categoryName });
        await newCategory.save();

        res.status(201).json({
            message: "Meal category created successfully",
            category: newCategory,
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
};

// Get all meal categories
export const getAllMealCategories = async (req, res) => {
    try {
        const categories = await MealCategory.find();
        res.status(200).json({
            message: "Meal categories retrieved successfully",
            categories,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve categories",
            message: error.message,
        });
    }
};

// Update a meal category
export const updateMealCategory = async (req, res) => {
    const { id } = req.params;
    const { categoryName } = req.body;

    try {
        const updatedCategory = await MealCategory.findByIdAndUpdate(
            id,
            { categoryName },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json({
            message: "Meal category updated successfully",
            category: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to update category",
            message: error.message,
        });
    }
};

// Delete a meal category
export const deleteMealCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await MealCategory.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json({
            message: "Meal category deleted successfully",
            category: deletedCategory,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete category",
            message: error.message,
        });
    }
};
