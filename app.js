import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import "./src/config/db.js";

import userRoutes from "./src/route/user.routes.js";

dotenv.config();

const app = express();



// MIDDLEWARE
app.use(cors());

app.use(express.json());



// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server Running");
});



// API ROUTES
app.use("/api/v1/users", userRoutes);

export default app;