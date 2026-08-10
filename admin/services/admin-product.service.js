import pool from "../../config/db.js";

import {
  createDesign,
  createProductVariant,
  createProductSizes,
} from "../repositories/admin-product.repository.js";

import {
  uploadAdminAssets,
} from "./admin-asset.service.js";

// =====================================
// CREATE COMPLETE PRODUCT
// =====================================

export async function createCompleteProduct(
  data
) {

  const client =
    await pool.connect();

  try {

    // =====================================
    // BEGIN TRANSACTION
    // =====================================

    await client.query(
      "BEGIN"
    );

    // =====================================
    // CREATE DESIGN
    // =====================================

    const design =
      await createDesign(
        client,
        {
          name:
            data.design.name,

          slug:
            data.design.slug,

          description:
            data.design.description,

          collectionId:
            data.design.collectionId,

          seoTitle:
            data.design.seoTitle,

          seoDescription:
            data.design.seoDescription,
        }
      );

    // =====================================
    // CREATE VARIANT
    // =====================================

    const variant =
      await createProductVariant(
        client,
        {
          designId:
            design.id,

          garmentTypeId:
            data.variant.garmentTypeId,

          colorId:
            data.variant.colorId,

          price:
            data.variant.price,

          sku:
            data.variant.sku,

          isHero:
            data.variant.isHero,

          displayOrder:
            data.variant.displayOrder,
        }
      );

    // =====================================
    // CREATE SIZES
    // =====================================

    await createProductSizes(
      client,
      variant.id,
      data.sizeIds || []
    );

    // =====================================
    // UPLOAD ASSETS
    // =====================================

    let assets = [];

    if (
      data.files &&
      data.files.length > 0
    ) {

      assets =
        await uploadAdminAssets({

          client,

          files:
            data.files,

          design,

          productVariantId:
            variant.id,

          garmentTypeId:
            data.variant.garmentTypeId,

          colorId:
            data.variant.colorId,

        });

    }

    // =====================================
    // COMMIT
    // =====================================

    await client.query(
      "COMMIT"
    );

    // =====================================
    // RETURN RESULT
    // =====================================

    return {

      design,

      variant,

      assets,

    };

  } catch (error) {

    console.error(
      "CREATE COMPLETE PRODUCT ERROR:",
      error
    );

    // =====================================
    // ROLLBACK
    // =====================================

    try {

      await client.query(
        "ROLLBACK"
      );

    } catch (rollbackError) {

      console.error(
        "ROLLBACK ERROR:",
        rollbackError
      );

    }

    throw error;

  } finally {

    // =====================================
    // RELEASE DATABASE CONNECTION
    // =====================================

    client.release();

  }

}