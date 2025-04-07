import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

import dotenv from "dotenv";
dotenv.config();


console.log("CORS Origin:", process.env.CORS_ORIGIN);


import userRouter from "./routes/userRoute.js";
import mealCategoryRouter from "./routes/MealCategoryRoute.js";
import dishRouter from "./routes/dishRoute.js";
import dishIngredientRouter from "./routes/dishIngredientRoute.js";
import connectDishIngredientRouter from "./routes/connectDishIngredientRoute.js";
import cartRouter from "./routes/cartRoutes.js"
import checkoutRoute from "./routes/checkoutRoute.js"

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request Origin:", origin);
      callback(null, origin); // Allow all origins dynamically
    },
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.status(200).json({ message: "SmartCart Backend is running!" });
});


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
app.use("/dishName", dishRouter);
app.use("/ingredientDetail", dishIngredientRouter);
app.use("/recipe-ingredients", connectDishIngredientRouter);
app.use("/cart", cartRouter);
app.use("/checkoutorder", checkoutRoute)


app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export { app };
