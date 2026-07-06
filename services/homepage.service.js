import pool from "../config/db.js";

// =====================================
// HOMEPAGE COLLECTIONS
// =====================================

export const getHomepageCollections = async () => {
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
      "GET HOMEPAGE COLLECTIONS ERROR:",
      error
    );

    throw error;

  }
};

// =====================================
// TRENDING DESIGNS
// =====================================

export const getTrendingDesigns = async () => {
  try {

    const query = `
      SELECT
        d.id,
        d.name,
        d.slug,
        d.thumbnail_image,
        d.seo_title,
        d.seo_description,

        MIN(pv.price) AS starting_price

      FROM designs d

      LEFT JOIN product_variants pv
        ON pv.design_id = d.id

      WHERE
        d.trending = true
        AND d.status = 'published'

      GROUP BY
        d.id

      ORDER BY
        d.name ASC;
    `;

    const result = await pool.query(query);

    return result.rows;

  } catch (error) {

    console.error(
      "GET TRENDING DESIGNS ERROR:",
      error
    );

    throw error;

  }
};

// =====================================
// LATEST DROPS
// =====================================

export const getLatestDrops = async () => {
  try {

    const query = `
      SELECT
        d.id,
        d.name,
        d.slug,
        d.thumbnail_image,
        d.seo_title,
        d.seo_description,

        MIN(pv.price) AS starting_price

      FROM designs d

      LEFT JOIN product_variants pv
        ON pv.design_id = d.id

      WHERE
        d.latest_drop = true
        AND d.status = 'published'

      GROUP BY
        d.id

      ORDER BY
        d.id DESC;
    `;

    const result = await pool.query(query);

    return result.rows;

  } catch (error) {

    console.error(
      "GET LATEST DROPS ERROR:",
      error
    );

    throw error;

  }
};

// =====================================
// BEST SELLERS
// =====================================

export const getBestSellers = async () => {
  try {

    const query = `
      SELECT
        d.id,
        d.name,
        d.slug,
        d.thumbnail_image,
        d.seo_title,
        d.seo_description,

        MIN(pv.price) AS starting_price

      FROM designs d

      LEFT JOIN product_variants pv
        ON pv.design_id = d.id

      WHERE
        d.best_seller = true
        AND d.status = 'published'

      GROUP BY
        d.id

      ORDER BY
        d.name ASC;
    `;

    const result = await pool.query(query);

    return result.rows;

  } catch (error) {

    console.error(
      "GET BEST SELLERS ERROR:",
      error
    );

    throw error;

  }
};