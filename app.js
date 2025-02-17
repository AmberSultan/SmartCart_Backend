import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

import userRouter from "./routes/userRoute.js";
import mealCategoryRouter from "./routes/MealCategoryRoute.js";
import dishRouter from "./routes/dishRoute.js";
import dishIngredientRouter from "./routes/dishIngredientRoute.js";
import connectDishIngredientRouter from "./routes/connectDishIngredientRoute.js";
import cartRouter from "./routes/cartRoutes.js"

const app = express();

// Enable CORS with specific origin and credentials
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow only the origin specified in the environment variable
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "uploads" directory
app.use("/uploads", express.static("uploads")); // Serve images from 'uploads' folder

// Middleware to parse cookies
app.use(cookieParser());

// Define routes for users and meal categories
app.use("/users", userRouter);
app.use("/mealcategory", mealCategoryRouter);
app.use("/dish", dishRouter);
app.use("/ingredient", dishIngredientRouter);
app.use("/recipe-ingredients", connectDishIngredientRouter);
app.use("/cart", cartRouter);



// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export { app };
