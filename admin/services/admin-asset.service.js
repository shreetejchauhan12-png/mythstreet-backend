import fs from "fs";

import {
  uploadToR2,
  deleteFromR2,
} from "../../assets/services/r2.service.js";

import {
  getNextSequence,
} from "../../assets/services/sequence.service.js";

import {
  generateFilename,
} from "../../assets/services/filename.service.js";

import {
  createAsset,
} from "../../assets/repositories/asset.repository.js";

import {
  validateMediaFile,
} from "../../assets/services/media-validation.service.js";

import {
  getGarmentTypeById,
  getColorById,
  getImageTypeByCode,
  getAssetTypeByCode,
  getAssetPurposeByCode,
} from "../../services/lookups.service.js";

// =====================================
// UPLOAD ADMIN ASSETS
// =====================================

export async function uploadAdminAssets({
  client,
  files,
  design,
  productVariantId,
  garmentTypeId,
  colorId,
}) {

  if (!client) {
    throw new Error(
      "Database transaction client is required."
    );
  }

  if (!files || files.length === 0) {
    throw new Error(
      "No files uploaded."
    );
  }

  if (!design) {
    throw new Error(
      "Design is required."
    );
  }

  const uploadedR2Keys = [];

  // =====================================
  // GALLERY DISPLAY ORDER
  // =====================================

  let displayOrder = 0;

  try {

    // =====================================
    // GARMENT LOOKUP
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
    // COLOR LOOKUP
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
    // ASSET TYPE
    // =====================================

    const assetType =
      await getAssetTypeByCode(
        "img"
      );

    if (!assetType) {
      throw new Error(
        "Image asset type not found."
      );
    }

    // =====================================
    // ASSET PURPOSE
    // =====================================

    const assetPurpose =
      await getAssetPurposeByCode(
        "product"
      );

    if (!assetPurpose) {
      throw new Error(
        "Product asset purpose not found."
      );
    }

    const assets = [];

    // =====================================
    // PROCESS FILES
    // =====================================

    for (const fileData of files) {

      const {
        file,
        imageTypeCode,
      } = fileData;

      if (!file) {
        throw new Error(
          "Invalid file received."
        );
      }

      if (!imageTypeCode) {
        throw new Error(
          `Image type missing for ${file.originalname}`
        );
      }

      // =====================================
      // MEDIA VALIDATION
      // =====================================

      const media =
        await validateMediaFile(
          file
        );

      // =====================================
      // IMAGE TYPE LOOKUP
      // =====================================

      const imageType =
        await getImageTypeByCode(
          imageTypeCode
        );

      if (!imageType) {
        throw new Error(
          `Image type not found: ${imageTypeCode}`
        );
      }

      // =====================================
      // SEQUENCE
      // =====================================

      const sequenceNumber =
        await getNextSequence({

          client,

          productVariantId,

          garmentTypeId,

          colorId,

          imageTypeId:
            imageType.id,

        });

      // =====================================
      // FILE EXTENSION
      // =====================================

      const extension =
        "." +
        media.extension;

      // =====================================
      // GENERATE FILENAME
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

      uploadedR2Keys.push(
        fileName
      );

      // =====================================
      // PRIMARY IMAGE
      // =====================================

      const isPrimary =
        imageType.code === "mg" &&
        Number(sequenceNumber) === 1;

      // =====================================
      // CREATE DATABASE ASSET
      // =====================================

      const asset =
        await createAsset(

          {

            productVariantId,

            garmentTypeId,

            colorId,

            imageTypeId:
              imageType.id,

            assetTypeId:
              assetType.id,

            assetPurposeId:
              assetPurpose.id,

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

            // =====================================
            // GALLERY ORDER
            // =====================================

            displayOrder,

            isPrimary,

            metadata:
              {},

          },

          client

        );

      assets.push(
        asset
      );

      // =====================================
      // MOVE TO NEXT GALLERY POSITION
      // =====================================

      displayOrder++;

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

    }

    return assets;

  } catch (error) {

    // =====================================
    // CLEAN R2 FILES
    // =====================================

    for (
      const key of uploadedR2Keys
    ) {

      try {

        await deleteFromR2(
          key
        );

      } catch (cleanupError) {

        console.error(
          "R2 CLEANUP ERROR:",
          cleanupError
        );

      }

    }

    // =====================================
    // CLEAN TEMP FILES
    // =====================================

    for (
      const fileData of files || []
    ) {

      const file =
        fileData.file;

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

    }

    throw error;

  }

}