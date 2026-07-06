import {
  getAllProducts,
  getProductById,
  getVariantsByDesign,
  searchProductsByName,
  getProductSizes,
  updateProductVariant,
  createVariant,
} from "../services/products.service.js";

// =====================================
// GET ALL PRODUCTS
// =====================================

export const getProducts = async (req, res) => {
  try {

    const products =
      await getAllProducts();

    return res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {

    console.error(
      "GET PRODUCTS CONTROLLER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =====================================
// GET SINGLE PRODUCT
// =====================================

export const getProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const product =
      await getProductById(id);

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    }

    const sizes =
      await getProductSizes(product.id);

    product.sizes = sizes;

    return res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {

    console.error(
      "GET PRODUCT CONTROLLER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =====================================
// GET DESIGN VARIANTS
// =====================================

export const getDesignVariants = async (
  req,
  res
) => {
  try {

    const { designId } = req.params;

    const variants =
      await getVariantsByDesign(designId);

    return res.status(200).json({
      success: true,
      data: variants,
    });

  } catch (error) {

    console.error(
      "GET VARIANTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =====================================
// SEARCH PRODUCTS
// =====================================

export const searchProducts = async (
  req,
  res
) => {
  try {

    const { q } = req.query;

    const products =
      await searchProductsByName(
        q || ""
      );

    return res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {

    console.error(
      "SEARCH PRODUCTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =====================================
// UPDATE PRODUCT VARIANT
// =====================================

export const editProduct = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    await updateProductVariant(
      id,
      req.body
    );

    return res.status(200).json({

      success: true,

      message:
        "Variant updated successfully",

    });

  } catch (error) {

    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

      error,

    });

  }
};

// =====================================
// CREATE PRODUCT VARIANT
// =====================================

export const createProductVariant = async (
  req,
  res
) => {
  try {

    const variant =
      await createVariant(req.body);

    return res.status(201).json({

      success: true,

      data: variant,

      message:
        "Variant created successfully",

    });

  } catch (error) {

    console.error(
      "CREATE PRODUCT VARIANT ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};