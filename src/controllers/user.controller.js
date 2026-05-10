import bcrypt from "bcryptjs";

import {
  createUserService,
  findUserByEmailService,
} from "../service/user.service.js";

import generateToken from "../utils/generateToken.js";



// ==============================
// REGISTER USER
// ==============================

export const registerUserController = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    // VALIDATION
    if (!name || !email || !password) {

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // PASSWORD LENGTH
    if (password.length < 6) {

      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // CREATE USER
    const user = await createUserService(
      name,
      email,
      password
    );

    // TOKEN
    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },

      token,
    });

  } catch (error) {

    console.log(
      "Register Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==============================
// LOGIN USER
// ==============================

export const loginUserController = async (
  req,
  res
) => {

  try {

    const { email, password } = req.body;

    // VALIDATION
    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // FIND USER
    const user =
      await findUserByEmailService(email);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // MATCH PASSWORD
    const isPasswordMatched =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordMatched) {

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // TOKEN
    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },

      token,
    });

  } catch (error) {

    console.log(
      "Login Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};