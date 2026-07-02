import pool from "../config/db.js";

// =====================================
// GET ALL COLLECTIONS
// =====================================

export const getAllCollections = async () => {
  try {

    const query = `
      SELECT
        id,
        name,
        slug
      FROM collections
      ORDER BY name ASC;
    `;

    const result = await pool.query(query);

    return result.rows;

  } catch (error) {

    console.error(
      "GET COLLECTIONS SERVICE ERROR:",
      error
    );

    throw error;

  }
};
