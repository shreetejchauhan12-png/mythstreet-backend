import pool from "../config/db.js";

// =====================================
// GET GARMENT TYPES
// =====================================

export const getGarmentTypes = async () => {
  const query = `
    SELECT
      id,
      name,
      slug,
      gender_visibility,
      hero_type
    FROM garment_types
    ORDER BY id;
  `;

  const result = await pool.query(query);

  return result.rows;
};

// =====================================
// GET COLORS
// =====================================

export const getColors = async () => {
  const query = `
    SELECT
      id,
      name,
      slug,
      hex_code
    FROM colors
    ORDER BY id;
  `;

  const result = await pool.query(query);

  return result.rows;
};

// =====================================
// GET SIZES
// =====================================

export const getSizes = async () => {
  const query = `
    SELECT
      id,
      name,
      sort_order
    FROM sizes
    ORDER BY sort_order;
  `;

  const result = await pool.query(query);

  return result.rows;
};