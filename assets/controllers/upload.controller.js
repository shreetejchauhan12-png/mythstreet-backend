import { uploadAssetService } from "../services/asset-upload.service.js";

export async function uploadAsset(req, res) {

  try {

    const result = await uploadAssetService({

      file: req.file,

      productVariantId: Number(req.body.productVariantId),

      garmentTypeId: Number(req.body.garmentTypeId),

      colorId: Number(req.body.colorId),

      imageTypeId: Number(req.body.imageTypeId),

      assetTypeId: Number(req.body.assetTypeId),

      assetPurposeId: Number(req.body.assetPurposeId),

    });

    return res.status(200).json({

      success: true,

      data: result,

    });

  } catch (error) {

    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

}