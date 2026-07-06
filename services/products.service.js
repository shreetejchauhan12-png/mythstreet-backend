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

// =====================================
// UPDATE PRODUCT VARIANT
// =====================================

export const updateProductVariant = async (
  id,
  data
) => {

  const client =
    await pool.connect();

  try {

    await client.query("BEGIN");

    // -----------------------
    // Variant
    // -----------------------

    await client.query(

      `
      UPDATE product_variants
      SET
        sku = $1,
        price = $2,
        is_hero = $3
      WHERE id = $4
      `,

      [
        data.sku,
        data.price,
        data.is_hero,
        id,
      ]

    );

    // -----------------------
    // Images
    // -----------------------

    await client.query(

      `
      UPDATE product_images
      SET
        main_image = $1,
        image_2 = $2,
        image_3 = $3,
        image_4 = $4,
        image_5 = $5,
        image_6 = $6,
        banner_image = $7
      WHERE product_variant_id = $8
      `,

      [
        data.main_image,
        data.image_2,
        data.image_3,
        data.image_4,
        data.image_5,
        data.image_6,
        data.banner_image,
        id,
      ]

    );

    // -----------------------
    // Sizes
    // -----------------------

    await client.query(

      `
      DELETE FROM product_sizes
      WHERE product_variant_id = $1
      `,

      [id]

    );

    for (const size of data.sizes) {

  let sizeId = size.id;

  // If frontend only sent the name,
  // fetch the correct database ID.
  if (!sizeId) {

    const result = await client.query(

      `
      SELECT id
      FROM sizes
      WHERE name = $1
      LIMIT 1
      `,

      [size.name]

    );

    if (result.rows.length === 0) {

      throw new Error(
        `Size '${size.name}' not found`
      );

    }

    sizeId = result.rows[0].id;

  }

  await client.query(

    `
    INSERT INTO product_sizes
    (
      product_variant_id,
      size_id
    )
    VALUES
    (
      $1,
      $2
    )
    `,

    [
      id,
      sizeId,
    ]

  );

}

    await client.query("COMMIT");

    return true;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};

// =====================================
// CREATE PRODUCT VARIANT
// =====================================

export const createVariant = async (data) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    // -----------------------
    // Product Variant
    // -----------------------

    const variantResult = await client.query(

      `
      INSERT INTO product_variants
      (
        design_id,
        garment_type_id,
        color_id,
        sku,
        price,
        qikink_product_id,
        is_hero,
        display_order
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8
      )
      RETURNING id;
      `,

      [
        data.design_id,
        data.garment_type_id,
        data.color_id,
        data.sku,
        data.price,
        data.qikink_product_id || null,
        data.is_hero,
        0,
      ]

    );

    const variantId =
      variantResult.rows[0].id;

    // -----------------------
    // Images
    // -----------------------

    await client.query(

      `
      INSERT INTO product_images
      (
        product_variant_id,
        main_image,
        image_2,
        image_3,
        image_4,
        image_5,
        image_6,
        banner_image
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8
      )
      `,

      [
        variantId,
        data.main_image,
        data.image_2,
        data.image_3,
        data.image_4,
        data.image_5,
        data.image_6,
        data.banner_image,
      ]

    );

    // -----------------------
    // Sizes
    // -----------------------

    for (const size of data.sizes) {

      let sizeId = size.id;

      if (!sizeId) {

        const result =
          await client.query(

            `
            SELECT id
            FROM sizes
            WHERE name = $1
            LIMIT 1
            `,

            [size.name]

          );

        if (
          result.rows.length === 0
        ) {

          throw new Error(
            `Size '${size.name}' not found`
          );

        }

        sizeId =
          result.rows[0].id;

      }

      await client.query(

        `
        INSERT INTO product_sizes
        (
          product_variant_id,
          size_id
        )
        VALUES
        (
          $1,
          $2
        )
        `,

        [
          variantId,
          sizeId,
        ]

      );

    }

    await client.query("COMMIT");

    return {

      id: variantId,

    };

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }

};