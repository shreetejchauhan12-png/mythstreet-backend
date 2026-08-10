import {
  getAssetsForVariant,
} from "../services/asset.service.js";

// =====================================
// GET ASSETS BY PRODUCT VARIANT
// =====================================

export async function getAssetsByVariant(
  req,
  res
) {

  try {

    const { variantId } = req.params;

    const assets =
      await getAssetsForVariant(
        Number(variantId)
      );

    return res.status(200).json({

      success: true,

      data: assets,

    });

  } catch (error) {

    console.error(
      "GET ASSETS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

}