import pool from "../config/db.js";

// =====================================
// SLUG GENERATOR
// =====================================

const generateSlug = (name) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

// =====================================
// GET ALL COLLECTIONS
// =====================================

export const getAllCollections = async () => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        slug,
        created_at,
        updated_at
      FROM collections
      ORDER BY name ASC;
      `
    );

    return result.rows;

  } catch (error) {

    console.error(
      "GET COLLECTIONS SERVICE ERROR:",
      error
    );

    throw error;

  }
};

// =====================================
// GET COLLECTION BY ID
// =====================================

export const getCollectionById = async (id) => {
  try {

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        slug,
        created_at,
        updated_at
      FROM collections
      WHERE id = $1
      LIMIT 1;
      `,
      [id]
    );

    return result.rows[0] || null;

  } catch (error) {

    console.error(
      "GET COLLECTION BY ID ERROR:",
      error
    );

    throw error;

  }
};

// =====================================
// CREATE COLLECTION
// =====================================

export const createCollection = async ({
  name,
}) => {
  try {

    const slug = generateSlug(name);

    const existing = await pool.query(
      `
      SELECT id
      FROM collections
      WHERE LOWER(name) = LOWER($1)
      LIMIT 1;
      `,
      [name]
    );

    if (existing.rows.length) {
      throw new Error(
        "Collection already exists."
      );
    }

    const result = await pool.query(
      `
      INSERT INTO collections
      (
        name,
        slug
      )
      VALUES
      (
        $1,
        $2
      )
      RETURNING *;
      `,
      [
        name,
        slug,
      ]
    );

    return result.rows[0];

  } catch (error) {

    console.error(
      "CREATE COLLECTION ERROR:",
      error
    );

    throw error;

  }
};

// =====================================
// UPDATE COLLECTION
// =====================================

export const updateCollection = async (
  id,
  {
    name,
  }
) => {
  try {

    const slug = generateSlug(name);

    const result = await pool.query(
      `
      UPDATE collections
      SET
        name = $1,
        slug = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
      `,
      [
        name,
        slug,
        id,
      ]
    );

    return result.rows[0] || null;

  } catch (error) {

    console.error(
      "UPDATE COLLECTION ERROR:",
      error
    );

    throw error;

  }
};

// =====================================
// DELETE COLLECTION
// =====================================

export const deleteCollection = async (
  id
) => {
  try {

    const result = await pool.query(
      `
      DELETE FROM collections
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    return result.rows[0] || null;

  } catch (error) {

    console.error(
      "DELETE COLLECTION ERROR:",
      error
    );

    throw error;

  }
};