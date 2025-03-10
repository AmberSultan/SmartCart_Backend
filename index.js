import dotenv from "dotenv";
import dbConnection from "./db/dbconnection.js";
import { app } from "./app.js";

// Load environment variables from the .env file
dotenv.config();

dbConnection() // Calling the function
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!!", err);
})




