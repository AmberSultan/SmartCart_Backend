import Dish from "../models/dishmodel.js";

// Create a new dish
export const createDish = async (req, res) => {
  try {
    const { dishName, categoryId } = req.body;

    const newDish = new Dish({
      dishName,
      categoryId,
    });

    const savedDish = await newDish.save();

    res.status(201).json({
      message: "Dish created successfully",
      dish: savedDish,
    });
  } catch (error) {
    console.error("Error creating dish:", error);
    res.status(500).json({ message: "Error creating dish", error });
  }
};

// Get all dishes
export const getDishes = async (req, res) => {
  try {
    const dishes = await Dish.find().populate("categoryId", "categoryName");
    res.status(200).json(dishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dishes", error });
  }
};

// Get dish by ID
export const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate("categoryId", "categoryName");
    if (!dish) return res.status(404).json({ message: "Dish not found" });
    res.status(200).json(dish);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dish", error });
  }
};

// Update a dish
export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { dishName, categoryId } = req.body;

    const updatedDish = await Dish.findByIdAndUpdate(id, { dishName, categoryId }, {
      new: true, // Return the updated document
      runValidators: true, // Run validation checks
    });

    if (!updatedDish) return res.status(404).json({ message: "Dish not found" });

    res.status(200).json({
      message: "Dish updated successfully",
      dish: updatedDish,
    });
  } catch (error) {
    console.error("Error updating dish:", error);
    res.status(500).json({ message: "Error updating dish", error });
  }
};

// Delete a dish
export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDish = await Dish.findByIdAndDelete(id);

    if (!deletedDish) return res.status(404).json({ message: "Dish not found" });

    res.status(200).json({ message: "Dish deleted successfully" });
  } catch (error) {
    console.error("Error deleting dish:", error);
    res.status(500).json({ message: "Error deleting dish", error });
  }
};
