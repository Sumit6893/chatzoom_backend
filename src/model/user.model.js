import db from "../config/db.js";



// ================================
// FIND USER BY EMAIL
// ================================

export const findUserByEmailModel = async (email) => {
  try {

    // INPUT VALIDATION
    if (!email) {
      throw new Error("Email is required");
    }

    const query = `
      SELECT 
        id,
        name,
        email,
        password,
        created_at,
        updated_at
      FROM users
      WHERE email = ?
      LIMIT 1
    `;

    // MYSQL2 PROMISE QUERY
    const [rows] = await db.promise().query(query, [email]);

    // USER NOT FOUND
    if (rows.length === 0) {
      return null;
    }

    return rows[0];

  } catch (error) {

    console.error("Find User By Email Model Error:", error.message);

    throw new Error("Database error while finding user");
  }
};




// ================================
// CREATE USER
// ================================

export const createUserModel = async (
  name,
  email,
  password
) => {

  try {

    // INPUT VALIDATION
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const query = `
      INSERT INTO users
      (
        name,
        email,
        password
      )
      VALUES (?, ?, ?)
    `;

    const [result] = await db.promise().query(
      query,
      [name, email, password]
    );

    // RETURN CREATED USER DATA
    return {
      id: result.insertId,
      name,
      email
    };

  } catch (error) {

    console.error("Create User Model Error:", error.message);

    // DUPLICATE EMAIL ERROR
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Email already exists");
    }

    throw new Error("Database error while creating user");
  }
};