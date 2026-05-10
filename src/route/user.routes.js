import express from "express";

import {
  loginUserController,
  registerUserController,
} from "../controllers/user.controller.js";

const router = express.Router();



// REGISTER
router.post(
  "/register",
  registerUserController
);



// LOGIN
router.post(
  "/login",
  loginUserController
);

export default router;