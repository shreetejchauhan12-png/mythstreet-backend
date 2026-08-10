import pool from "../config/db.js";

// =====================================
// GARMENTS
// =====================================

export const getGarmentTypes = async () => {

  const result = await pool.query(`
    SELECT *
    FROM garments
    WHERE is_active = TRUE
    ORDER BY display_order;
  `);

  return result.rows;

};

export const getGarmentTypeById = async (id) => {

  const result = await pool.query(
    `
    SELECT *
    FROM garments
    WHERE id = $1
    LIMIT 1;
    `,
    [id]
  );

  return result.rows[0] || null;

};

// =====================================
// COLORS
// =====================================

export const getColors = async () => {

  const result = await pool.query(`
    SELECT *
    FROM colors
    WHERE is_active = TRUE
    ORDER BY display_order;
  `);

  return result.rows;

};

export const getColorById = async (id) => {

  const result = await pool.query(
    `
    SELECT *
    FROM colors
    WHERE id = $1
    LIMIT 1;
    `,
    [id]
  );

  return result.rows[0] || null;

};

// =====================================
// IMAGE TYPES
// =====================================

export const getImageTypes = async () => {

  const result = await pool.query(`
    SELECT *
    FROM image_types
    WHERE is_active = TRUE
    ORDER BY display_order;
  `);

  return result.rows;

};

export const getImageTypeById = async (id) => {

  const result = await pool.query(
    `
    SELECT *
    FROM image_types
    WHERE id = $1
    LIMIT 1;
    `,
    [id]
  );

  return result.rows[0] || null;

};

// =====================================
// IMAGE TYPE BY CODE
// =====================================

export const getImageTypeByCode = async (code) => {

  const result = await pool.query(
    `
    SELECT *
    FROM image_types
    WHERE code = $1
      AND is_active = TRUE
    LIMIT 1;
    `,
    [code]
  );

  return result.rows[0] || null;

};

// =====================================
// ASSET TYPES
// =====================================

export const getAssetTypes = async () => {

  const result = await pool.query(`
    SELECT *
    FROM asset_types
    WHERE is_active = TRUE
    ORDER BY id;
  `);

  return result.rows;

};

export const getAssetTypeByCode = async (code) => {

  const result = await pool.query(
    `
    SELECT *
    FROM asset_types
    WHERE code = $1
      AND is_active = TRUE
    LIMIT 1;
    `,
    [code]
  );

  return result.rows[0] || null;

};

// =====================================
// ASSET PURPOSES
// =====================================

export const getAssetPurposes = async () => {

  const result = await pool.query(`
    SELECT *
    FROM asset_purposes
    WHERE is_active = TRUE
    ORDER BY id;
  `);

  return result.rows;

};

export const getAssetPurposeByCode = async (code) => {

  const result = await pool.query(
    `
    SELECT *
    FROM asset_purposes
    WHERE code = $1
      AND is_active = TRUE
    LIMIT 1;
    `,
    [code]
  );

  return result.rows[0] || null;

};

// =====================================
// SIZES
// =====================================

export const getSizes = async () => {

  const result = await pool.query(`
    SELECT
      id,
      name,
      sort_order
    FROM sizes
    ORDER BY sort_order;
  `);

  return result.rows;

};