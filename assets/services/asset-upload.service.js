import fs from "fs";

import { uploadToR2 } from "./r2.service.js";
import { getNextSequence } from "./sequence.service.js";
import { generateFilename } from "./filename.service.js";
import { createAsset } from "../repositories/asset.repository.js";

import { validateMediaFile } from "./media-validation.service.js";

import {
  getGarmentTypeById,
  getColorById,
  getImageTypeById,
} from "../../services/lookups.service.js";

import { getDesignById } from "../../services/designs.service.js";
import { getProductVariantById } from "../../services/products.service.js";

// =====================================
// UPLOAD ASSET
// =====================================

export async function uploadAssetService({
  file,
  productVariantId,
  garmentTypeId,
  colorId,
  imageTypeId,
  assetTypeId,
  assetPurposeId,
}) {

  if (!file) {
    throw new Error(
      "No file uploaded."
    );
  }

  try {

    // =====================================
    // VALIDATE ACTUAL MEDIA FILE
    // =====================================

    const media =
      await validateMediaFile(
        file
      );

    // =====================================
    // PRODUCT VARIANT
    // =====================================

    const variant =
      await getProductVariantById(
        productVariantId
      );

    if (!variant) {
      throw new Error(
        "Product variant not found."
      );
    }

    // =====================================
    // DESIGN
    // =====================================

    const design =
      await getDesignById(
        variant.design_id
      );

    if (!design) {
      throw new Error(
        "Design not found."
      );
    }

    // =====================================
    // GARMENT
    // =====================================

    const garmentType =
      await getGarmentTypeById(
        garmentTypeId
      );

    if (!garmentType) {
      throw new Error(
        "Garment type not found."
      );
    }

    // =====================================
    // COLOR
    // =====================================

    const color =
      await getColorById(
        colorId
      );

    if (!color) {
      throw new Error(
        "Color not found."
      );
    }

    // =====================================
    // IMAGE TYPE
    // =====================================

    const imageType =
      await getImageTypeById(
        imageTypeId
      );

    if (!imageType) {
      throw new Error(
        "Image type not found."
      );
    }

    // =====================================
    // SEQUENCE
    // =====================================

    const sequenceNumber =
      await getNextSequence({

        productVariantId,

        garmentTypeId,

        colorId,

        imageTypeId,

      });

    // =====================================
    // EXTENSION
    // =====================================

    const extension =
      "." +
      media.extension;

    // =====================================
    // FILENAME
    // =====================================

    const fileName =
      generateFilename({

        designSlug:
          design.slug,

        garmentCode:
          garmentType.code,

        colorCode:
          color.code,

        imageTypeCode:
          imageType.code,

        sequenceNumber,

        extension,

      });

    // =====================================
    // READ FILE
    // =====================================

    const fileBuffer =
      fs.readFileSync(
        file.path
      );

    // =====================================
    // UPLOAD TO R2
    // =====================================

    const upload =
      await uploadToR2({

        key:
          fileName,

        body:
          fileBuffer,

        contentType:
          media.mimeType,

      });

    // =====================================
    // DELETE TEMP FILE
    // =====================================

    if (
      file.path &&
      fs.existsSync(
        file.path
      )
    ) {

      fs.unlinkSync(
        file.path
      );

    }

    // =====================================
    // CREATE DATABASE ASSET
    // =====================================

    const asset =
      await createAsset({

        productVariantId,

        garmentTypeId,

        colorId,

        imageTypeId,

        assetTypeId,

        assetPurposeId,

        fileName,

        fileExtension:
          media.extension,

        sequenceNumber:
          Number(
            sequenceNumber
          ),

        originalName:
          file.originalname,

        fileUrl:
          upload.url,

        mimeType:
          media.mimeType,

        fileSize:
          file.size,

        width:
          null,

        height:
          null,

        duration:
          null,

        altText:
          null,

        displayOrder:
          0,

        isPrimary:
          imageType.code === "mg",

        metadata:
          {},

      });

    return asset;

  } catch (error) {

    // =====================================
    // DELETE TEMP FILE ON ERROR
    // =====================================

    if (
      file?.path &&
      fs.existsSync(
        file.path
      )
    ) {

      fs.unlinkSync(
        file.path
      );

    }

    throw error;

  }

}