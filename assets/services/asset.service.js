import {
  getAssetsByVariantId,
} from "../repositories/asset.repository.js";

// =====================================
// GET ASSETS BY PRODUCT VARIANT
// =====================================

export async function getAssetsForVariant(
  productVariantId
) {

  return await getAssetsByVariantId(
    productVariantId
  );

}