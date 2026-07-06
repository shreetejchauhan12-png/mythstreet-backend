import pool from "../config/db.js";

// =====================================
// GET ALL DESIGNS
// =====================================

export const getAllDesigns = async () => {
  try {

    const query = `
      SELECT
        d.id,
        d.name,
        d.slug,
        d.description,
        d.thumbnail_image,
        d.seo_title,
        d.seo_description,

        d.status,
d.featured,
d.trending,
d.latest_drop,
d.best_seller,

        c.id AS collection_id,
        c.name AS collection,
        c.slug AS collection_slug,

        COUNT(pv.id) AS total_variants,

        MIN(pv.price) AS starting_price,

        MAX(
          CASE
            WHEN pv.is_hero = true
            THEN 1
            ELSE 0
          END
        ) AS has_hero,

        MAX(pi.main_image) AS main_image

      FROM designs d

      INNER JOIN collections c
        ON d.collection_id = c.id

      LEFT JOIN product_variants pv
        ON pv.design_id = d.id

      LEFT JOIN product_images pi
        ON pi.product_variant_id = pv.id

      GROUP BY
        d.id,
        c.id

      ORDER BY
        d.name ASC;
    `;

    const result = await pool.query(query);

    return result.rows;

  } catch (error) {

    console.error(
      "GET DESIGNS ERROR:",
      error
    );

    throw error;

  }
};

// =====================================
// GET DESIGN BY ID
// =====================================

export const getDesignById = async (id) => {
  try {

    const query = `
      SELECT
        d.id,
        d.name,
        d.slug,
        d.description,
        d.thumbnail_image,
d.seo_title,
d.seo_description,

d.status,
d.featured,
d.trending,
d.latest_drop,
d.best_seller,

c.id AS collection_id,
        c.name AS collection,
        c.slug AS collection_slug

      FROM designs d

      INNER JOIN collections c
        ON d.collection_id = c.id

      WHERE d.id = $1;
    `;

    const result = await pool.query(
      query,
      [id]
    );

    return result.rows[0];

  } catch (error) {

    console.error(
      "GET DESIGN BY ID ERROR:",
      error
    );

    throw error;

  }
};

// =====================================
// UPDATE DESIGN
// =====================================

export const updateDesign = async (
  id,
  {
    name,
    description,
    seo_title,
    seo_description,
    status,
    featured,
    trending,
    latest_drop,
    best_seller,
  }
) => {
  try {

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const query = `
      UPDATE designs
      SET
  name = $1,
  slug = $2,
  description = $3,
  seo_title = $4,
  seo_description = $5,

  status = $6,
  featured = $7,
  trending = $8,
  latest_drop = $9,
  best_seller = $10

WHERE id = $11

RETURNING *;
    `;

    const values = [
  name,
  slug,
  description,
  seo_title,
  seo_description,

  status,
  featured,
  trending,
  latest_drop,
  best_seller,

  id,
];

    const result = await pool.query(
      query,
      values
    );

    return result.rows[0];

  } catch (error) {

    console.error(
      "UPDATE DESIGN ERROR:",
      error
    );

    throw error;

  }
};

// =====================================
// CREATE DESIGN
// =====================================

export const createDesign = async ({
  name,
  collection_id,
  description,
  seo_title,
  seo_description,
}) => {
  try {

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const query = `
      INSERT INTO designs
      (
        name,
        slug,
        collection_id,
        description,
        seo_title,
        seo_description
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      RETURNING *;
    `;

    const values = [
      name,
      slug,
      collection_id,
      description,
      seo_title,
      seo_description,
    ];

    const result = await pool.query(
      query,
      values
    );

    return result.rows[0];

  } catch (error) {

    console.error(
      "CREATE DESIGN ERROR:",
      error
    );

    throw error;

  }
};