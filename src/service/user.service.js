import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  createUserModel,
  findUserByEmailModel,
} from "../model/user.model.js";



// ==============================
// FIND USER
// ==============================

export const findUserByEmailService = async (
  email
) => {

  return await findUserByEmailModel(email);

};



// ==============================
// CREATE USER
// ==============================

export const createUserService = async (
  name,
  email,
  password
) => {

  // CHECK USER EXIST
  const existingUser =
    await findUserByEmailModel(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  // HASH PASSWORD
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(
    password,
    salt
  );

  // CREATE USER
  const user = await createUserModel(
    name,
    email,
    hashedPassword
  );

  return user;
};

// ==============================
// LOGIN USER
// ==============================

export const loginUserService = async (
  email,
  password
) => {

  // VALIDATION
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // FIND USER
  const user = await findUserByEmailModel(email);

  // USER NOT FOUND
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // CHECK PASSWORD
  const isPasswordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  // GENERATE JWT TOKEN
  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // RETURN USER + TOKEN
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
     
    },
    token,
  };
};