import {
  getProductsV2,
  getProductV2ById,
} from "../services/products-v2.service.js";

// =====================================
// GET ALL PRODUCTS (V2)
// =====================================

export async function getAllProductsV2Controller(
  req,
  res
) {

  try {

    const products =
      await getProductsV2();

    return res.status(200).json({

      success: true,

      data: products,

    });

  } catch (error) {

    console.error(
      "GET PRODUCTS V2 ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

}

// =====================================
// GET SINGLE PRODUCT (V2)
// =====================================

export async function getProductV2ByIdController(
  req,
  res
) {

  try {

    const { id } = req.params;

    const product =
      await getProductV2ById(
        Number(id)
      );

    if (!product) {

      return res.status(404).json({

        success: false,

        message: "Product not found",

      });

    }

    return res.status(200).json({

      success: true,

      data: product,

    });

  } catch (error) {

    console.error(
      "GET PRODUCT V2 ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

}