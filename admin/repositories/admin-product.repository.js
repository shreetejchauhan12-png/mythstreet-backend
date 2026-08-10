import pool from "../../config/db.js";

// =====================================
// CREATE DESIGN
// =====================================

export async function createDesign(client, {
  name,
  slug,
  description,
  collectionId,
  seoTitle,
  seoDescription,
}) {

  const result = await client.query(
    `
    INSERT INTO designs
    (
      name,
      slug,
      description,
      collection_id,
      seo_title,
      seo_description
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6
    )
    RETURNING *;
    `,
    [
      name,
      slug,
      description,
      collectionId,
      seoTitle,
      seoDescription,
    ]
  );

  return result.rows[0];

}

// =====================================
// CREATE PRODUCT VARIANT
// =====================================

export async function createProductVariant(client, {
  designId,
  garmentTypeId,
  colorId,
  price,
  sku,
  isHero,
  displayOrder,
}) {

  const result = await client.query(
    `
    INSERT INTO product_variants
    (
      design_id,
      garment_type_id,
      color_id,
      price,
      sku,
      is_hero,
      display_order
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6,$7
    )
    RETURNING *;
    `,
    [
      designId,
      garmentTypeId,
      colorId,
      price,
      sku,
      isHero,
      displayOrder,
    ]
  );

  return result.rows[0];

}

// =====================================
// CREATE PRODUCT SIZES
// =====================================

export async function createProductSizes(
  client,
  productVariantId,
  sizeIds
) {

  for (const sizeId of sizeIds) {

    await client.query(
      `
      INSERT INTO product_sizes
      (
        product_variant_id,
        size_id
      )
      VALUES
      (
        $1,$2
      );
      `,
      [
        productVariantId,
        sizeId,
      ]
    );

  }

}