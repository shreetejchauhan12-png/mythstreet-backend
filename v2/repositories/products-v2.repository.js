import pool from "../../config/db.js";

// =====================================
// GET ALL PRODUCTS (V2)
// =====================================

export async function getAllProductsV2() {

  const result = await pool.query(`
    SELECT

      pv.id,
      pv.design_id,
      pv.garment_type_id,
      pv.color_id,
      pv.price,
      pv.sku,
      pv.is_hero,
      pv.display_order,

      d.name AS title,
      d.slug AS design_slug,

      c.name AS collection,
      c.slug AS collection_slug,

      g.name AS garment_name,
      g.code AS garment_code,

      clr.name AS color_name,
      clr.code AS color_code,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', s.id,
              'name', s.name,
              'sort_order', s.sort_order
            )
            ORDER BY s.sort_order
          )
          FROM product_sizes ps
          INNER JOIN sizes s
            ON ps.size_id = s.id
          WHERE ps.product_variant_id = pv.id
        ),
        '[]'
      ) AS sizes,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', pa.id,
              'url', pa.file_url,
              'file_name', pa.file_name,
              'image_type', it.name,
              'image_code', it.code,
              'display_order', pa.display_order,
              'is_primary', pa.is_primary
            )
            ORDER BY
              pa.display_order ASC,
              pa.id ASC
          )
          FROM product_assets pa
          INNER JOIN image_types it
            ON pa.image_type_id = it.id
          WHERE pa.product_variant_id = pv.id
        ),
        '[]'
      ) AS assets

    FROM product_variants pv

    INNER JOIN designs d
      ON pv.design_id = d.id

    INNER JOIN collections c
      ON d.collection_id = c.id

    INNER JOIN garments g
      ON pv.garment_type_id = g.id

    INNER JOIN colors clr
      ON pv.color_id = clr.id

    ORDER BY
      pv.display_order ASC,
      pv.id DESC;
  `);

  return result.rows;

}


// =====================================
// GET SINGLE PRODUCT (V2)
// =====================================

export async function getProductByIdV2(id) {

  const result = await pool.query(`
    SELECT

      pv.id,
      pv.design_id,
      pv.garment_type_id,
      pv.color_id,
      pv.price,
      pv.sku,
      pv.is_hero,
      pv.display_order,

      d.name AS title,
      d.slug AS design_slug,
      d.description,

      c.name AS collection,
      c.slug AS collection_slug,

      g.name AS garment_name,
      g.code AS garment_code,

      clr.name AS color_name,
      clr.code AS color_code,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', s.id,
              'name', s.name,
              'sort_order', s.sort_order
            )
            ORDER BY s.sort_order
          )
          FROM product_sizes ps
          INNER JOIN sizes s
            ON ps.size_id = s.id
          WHERE ps.product_variant_id = pv.id
        ),
        '[]'
      ) AS sizes,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', pa.id,
              'url', pa.file_url,
              'file_name', pa.file_name,
              'image_type', it.name,
              'image_code', it.code,
              'display_order', pa.display_order,
              'is_primary', pa.is_primary
            )
            ORDER BY
              pa.display_order ASC,
              pa.id ASC
          )
          FROM product_assets pa
          INNER JOIN image_types it
            ON pa.image_type_id = it.id
          WHERE pa.product_variant_id = pv.id
        ),
        '[]'
      ) AS assets

    FROM product_variants pv

    INNER JOIN designs d
      ON pv.design_id = d.id

    INNER JOIN collections c
      ON d.collection_id = c.id

    INNER JOIN garments g
      ON pv.garment_type_id = g.id

    INNER JOIN colors clr
      ON pv.color_id = clr.id

    WHERE pv.id = $1;
  `, [id]);

  return result.rows[0] || null;

}