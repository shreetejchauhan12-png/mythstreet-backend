import pool from "../config/db.js";

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

    console.log(result.rows);

    return result.rows;

  } catch (error) {
    console.error("GET DESIGNS ERROR:", error);
    throw error;
  }
};
