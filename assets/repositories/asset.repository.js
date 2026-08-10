import pool from "../../config/db.js";

// =====================================
// GET MAX SEQUENCE
// =====================================

export async function getMaxSequence({
  client = pool,
  productVariantId,
  garmentTypeId,
  colorId,
  imageTypeId,
}) {

  const result = await client.query(
    `
    SELECT
      COALESCE(MAX(sequence_number), 0) AS max_sequence
    FROM product_assets
    WHERE product_variant_id = $1
      AND garment_type_id = $2
      AND color_id = $3
      AND image_type_id = $4;
    `,
    [
      productVariantId,
      garmentTypeId,
      colorId,
      imageTypeId,
    ]
  );

  return Number(
    result.rows[0].max_sequence
  );

}

// =====================================
// CREATE ASSET
// =====================================

export async function createAsset(
  asset,
  client = pool
) {

  const {
    productVariantId,
    garmentTypeId,
    colorId,
    imageTypeId,
    assetTypeId,
    assetPurposeId,
    fileName,
    fileExtension,
    sequenceNumber,
    originalName,
    fileUrl,
    mimeType,
    fileSize,
    width,
    height,
    duration,
    altText,
    displayOrder,
    isPrimary,
    metadata,
  } = asset;

  const result = await client.query(
    `
    INSERT INTO product_assets
    (
      product_variant_id,
      garment_type_id,
      color_id,
      image_type_id,
      asset_type_id,
      asset_purpose_id,
      file_name,
      file_extension,
      sequence_number,
      original_name,
      file_url,
      mime_type,
      file_size,
      width,
      height,
      duration,
      alt_text,
      display_order,
      is_primary,
      metadata
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6,
      $7,$8,$9,$10,$11,$12,
      $13,$14,$15,$16,$17,
      $18,$19,$20
    )
    RETURNING *;
    `,
    [
      productVariantId,
      garmentTypeId,
      colorId,
      imageTypeId,
      assetTypeId,
      assetPurposeId,
      fileName,
      fileExtension,
      sequenceNumber,
      originalName,
      fileUrl,
      mimeType,
      fileSize,
      width,
      height,
      duration,
      altText,
      displayOrder,
      isPrimary,
      metadata,
    ]
  );

  return result.rows[0];

}

// =====================================
// GET ASSETS BY PRODUCT VARIANT
// =====================================

export async function getAssetsByVariantId(
  productVariantId
) {

  const result = await pool.query(
    `
    SELECT

      pa.id,

      pa.product_variant_id,

      pa.file_name,

      pa.file_url,

      pa.file_extension,

      pa.display_order,

      pa.is_primary,

      pa.width,

      pa.height,

      pa.file_size,

      pa.created_at,

      c.id AS color_id,
      c.name AS color_name,
      c.code AS color_code,

      g.id AS garment_type_id,
      g.name AS garment_name,
      g.code AS garment_code,

      it.id AS image_type_id,
      it.name AS image_type_name,
      it.code AS image_type_code,

      at.id AS asset_type_id,
      at.name AS asset_type_name,
      at.code AS asset_type_code,

      ap.id AS asset_purpose_id,
      ap.name AS asset_purpose_name,
      ap.code AS asset_purpose_code

    FROM product_assets pa

    INNER JOIN garments g
      ON pa.garment_type_id = g.id

    INNER JOIN colors c
      ON pa.color_id = c.id

    INNER JOIN image_types it
      ON pa.image_type_id = it.id

    INNER JOIN asset_types at
      ON pa.asset_type_id = at.id

    INNER JOIN asset_purposes ap
      ON pa.asset_purpose_id = ap.id

    WHERE pa.product_variant_id = $1

    ORDER BY
      pa.display_order ASC,
      pa.id ASC;
    `,
    [productVariantId]
  );

  return result.rows;

}