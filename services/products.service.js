import pool from "../config/db.js";

// =====================================
// GET ALL PRODUCTS
// =====================================
export const getAllProducts = async () => {
  try {
    const query = `
      SELECT
        pv.id,
        pv.design_id,
        pv.garment_type_id,
        pv.color_id,

        pv.price,
        pv.qikink_product_id,
        pv.is_hero,
        pv.display_order,
        pv.sku,

        d.name AS title,
        d.name AS design,
        d.slug AS design_slug,
        d.thumbnail_image,
        d.seo_title,
        d.seo_description,

        c.name AS collection,
        c.slug AS collection_slug,

        gt.name AS type,
        gt.slug AS garment_slug,

        clr.name AS color_name,
        clr.slug AS color_slug,
        clr.hex_code,

        pi.main_image,
        pi.image_2,
        pi.image_3,
        pi.image_4,
        pi.image_5,
        pi.image_6,
        pi.banner_image,

        gt.gender_visibility,
        gt.hero_type

      FROM product_variants pv

      INNER JOIN designs d
        ON pv.design_id = d.id

      INNER JOIN collections c
        ON d.collection_id = c.id

      INNER JOIN garment_types gt
        ON pv.garment_type_id = gt.id

      INNER JOIN colors clr
        ON pv.color_id = clr.id

      LEFT JOIN product_images pi
        ON pi.product_variant_id = pv.id

      ORDER BY
        pv.display_order ASC,
        pv.id ASC;
    `;

    const result = await pool.query(query);

    return result.rows;

  } catch (error) {
    console.error("GET ALL PRODUCTS ERROR:", error);
    throw error;
  }
};

// =====================================
// GET SINGLE PRODUCT
// =====================================
export const getProductById = async (id) => {
  try {
    const query = `
      SELECT
        pv.id,
        pv.design_id,
        pv.garment_type_id,
        pv.color_id,

        pv.price,
        pv.qikink_product_id,
        pv.is_hero,
        pv.display_order,
        pv.sku,

        d.name AS title,
        d.name AS design,
        d.slug AS design_slug,
        d.description,
        d.seo_title,
        d.seo_description,
        d.thumbnail_image,

        c.name AS collection,
        c.slug AS collection_slug,

        gt.name AS type,
        gt.slug AS garment_slug,

        clr.name AS color_name,
        clr.slug AS color_slug,
        clr.hex_code,

        pi.main_image,
        pi.image_2,
        pi.image_3,
        pi.image_4,
        pi.image_5,
        pi.image_6,
        pi.banner_image,

        gt.gender_visibility,
        gt.hero_type

      FROM product_variants pv

      INNER JOIN designs d
        ON pv.design_id = d.id

      INNER JOIN collections c
        ON d.collection_id = c.id

      INNER JOIN garment_types gt
        ON pv.garment_type_id = gt.id

      INNER JOIN colors clr
        ON pv.color_id = clr.id

      LEFT JOIN product_images pi
        ON pi.product_variant_id = pv.id

      WHERE pv.id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];

  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    throw error;
  }
};

// =====================================
// GET ALL VARIANTS OF A DESIGN
// =====================================
export const getVariantsByDesign = async (designId) => {
  try {
    const query = `
      SELECT
        pv.id,
        pv.design_id,
        pv.garment_type_id,
        pv.color_id,
        pv.price,
        pv.is_hero,
        pv.display_order,
        pv.sku,

        d.name AS title,
        d.name AS design,
        d.slug AS design_slug,

        gt.name AS garment_type,
        gt.slug AS garment_slug,

        clr.name AS color_name,
        clr.slug AS color_slug,
        clr.hex_code,

        pi.main_image,
        pi.image_2,
        pi.image_3,
        pi.image_4,
        pi.image_5,
        pi.image_6,
        pi.banner_image

      FROM product_variants pv

      INNER JOIN designs d
        ON pv.design_id = d.id

      INNER JOIN garment_types gt
        ON pv.garment_type_id = gt.id

      INNER JOIN colors clr
        ON pv.color_id = clr.id

      LEFT JOIN product_images pi
        ON pi.product_variant_id = pv.id

      WHERE pv.design_id = $1

      ORDER BY
        gt.id,
        clr.id;
    `;

    const result = await pool.query(query, [designId]);

    return result.rows;

  } catch (error) {
    console.error("GET VARIANTS ERROR:", error);
    throw error;
  }
};

// =====================================
// SEARCH PRODUCTS
// =====================================
export const searchProductsByName = async (search) => {
  try {
    const query = `
      SELECT
        pv.id,
        pv.design_id,
        pv.garment_type_id,
        pv.color_id,

        pv.price,
        pv.sku,

        d.name AS title,
        d.name AS design,
        d.slug AS design_slug,

        pi.main_image

      FROM product_variants pv

      INNER JOIN designs d
        ON pv.design_id = d.id

      LEFT JOIN product_images pi
        ON pi.product_variant_id = pv.id

      WHERE LOWER(d.name) LIKE LOWER($1)

      ORDER BY d.name;
    `;

    const result = await pool.query(query, [`%${search}%`]);

    return result.rows;

  } catch (error) {
    console.error("SEARCH PRODUCTS ERROR:", error);
    throw error;
  }
};

// =====================================
// GET PRODUCT SIZES
// =====================================
export const getProductSizes = async (productVariantId) => {
  try {
    const query = `
      SELECT
        s.id,
        s.name,
        s.sort_order

      FROM product_sizes ps

      INNER JOIN sizes s
        ON ps.size_id = s.id

      WHERE ps.product_variant_id = $1

      ORDER BY s.sort_order;
    `;

    const result = await pool.query(query, [productVariantId]);

    return result.rows;

  } catch (error) {
    console.error("GET PRODUCT SIZES ERROR:", error);
    throw error;
  }
};