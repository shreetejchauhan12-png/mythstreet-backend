import {
  createCompleteProduct,
} from "../services/admin-product.service.js";

import {
  validateCreateProduct,
} from "../validators/admin-product.validator.js";

// =====================================
// CREATE COMPLETE PRODUCT
// =====================================

export async function createProduct(
  req,
  res
) {

  try {

    // =====================================
    // CONVERT MULTER FILES
    // =====================================

    const files = [];

    const imageGroups = [
      {
        field: "main",
        imageTypeCode: "mg",
      },
      {
        field: "front",
        imageTypeCode: "f",
      },
      {
        field: "back",
        imageTypeCode: "b",
      },
      {
        field: "left",
        imageTypeCode: "l",
      },
      {
        field: "right",
        imageTypeCode: "r",
      },
      {
        field: "close_up",
        imageTypeCode: "cu",
      },
      {
        field: "lifestyle",
        imageTypeCode: "ls",
      },
    ];

    // =====================================
    // BUILD FILE LIST
    // =====================================

    for (const group of imageGroups) {

      const uploadedFiles =
        req.files?.[group.field] || [];

      for (
        let index = 0;
        index < uploadedFiles.length;
        index++
      ) {

        const file =
          uploadedFiles[index];

        files.push({

          file,

          imageTypeCode:
            group.imageTypeCode,

          displayOrder:
            index,

        });

      }

    }

    // =====================================
    // PARSE SIZE IDS
    // =====================================

    let sizeIds = [];

    if (req.body.sizeIds) {

      try {

        sizeIds =
          JSON.parse(
            req.body.sizeIds
          );

      } catch (error) {

        return res.status(400).json({

          success: false,

          message:
            "sizeIds must be valid JSON.",

        });

      }

    }

    // =====================================
    // BUILD PRODUCT DATA
    // =====================================

    const productData = {

      design: {

        name:
          req.body.name,

        slug:
          req.body.slug,

        description:
          req.body.description,

        collectionId:
          Number(
            req.body.collectionId
          ),

        seoTitle:
          req.body.seoTitle || null,

        seoDescription:
          req.body.seoDescription || null,

      },

      variant: {

        garmentTypeId:
          Number(
            req.body.garmentTypeId
          ),

        colorId:
          Number(
            req.body.colorId
          ),

        price:
          Number(
            req.body.price
          ),

        sku:
          req.body.sku || null,

        isHero:
          req.body.isHero === "true",

        displayOrder:
          Number(
            req.body.displayOrder || 0
          ),

      },

      sizeIds,

      files,

    };

    // =====================================
    // VALIDATE
    // =====================================

    const validation =
      validateCreateProduct(
        productData
      );

    if (!validation.valid) {

      return res.status(400).json({

        success: false,

        message:
          "Product validation failed.",

        errors:
          validation.errors,

      });

    }

    // =====================================
    // CREATE PRODUCT
    // =====================================

    const result =
      await createCompleteProduct(
        productData
      );

    // =====================================
    // SUCCESS
    // =====================================

    return res.status(201).json({

      success: true,

      data: result,

      message:
        "Product created successfully",

    });

  } catch (error) {

    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

}