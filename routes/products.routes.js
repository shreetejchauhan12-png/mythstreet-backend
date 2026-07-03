import express from "express";

import {
  getProducts,
  getProduct,
  getDesignVariants,
  searchProducts,
  editProduct,
} from "../controllers/products.controller.js";

const router = express.Router();

// =====================================
// PRODUCTS
// =====================================

// GET ALL PRODUCTS
router.get("/", getProducts);

// SEARCH PRODUCTS
router.get("/search", searchProducts);

// GET ALL VARIANTS OF A DESIGN
router.get("/design/:designId", getDesignVariants);

// GET SINGLE PRODUCT
router.get("/:id", getProduct);

// UPDATE PRODUCT VARIANT
router.put("/:id", editProduct);

export default router;