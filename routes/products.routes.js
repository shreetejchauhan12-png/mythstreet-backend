import express from "express";

import auth from "../middleware/auth.js";

import {
  getProducts,
  getProduct,
  getDesignVariants,
  searchProducts,
  editProduct,
  createProductVariant,
} from "../controllers/products.controller.js";

import {
  getCart,
  addToCart,
  decreaseCart,
  removeCartItem,
} from "../controllers/cart.controller.js";

const router = express.Router();

// =====================================
// CART
// =====================================

router.get(
  "/cart",
  auth,
  getCart
);

router.post(
  "/cart",
  auth,
  addToCart
);

router.post(
  "/cart/decrease",
  auth,
  decreaseCart
);

router.delete(
  "/cart",
  auth,
  removeCartItem
);

// =====================================
// PRODUCTS
// =====================================

// GET ALL PRODUCTS
router.get("/", getProducts);

// SEARCH PRODUCTS
router.get("/search", searchProducts);

// GET ALL VARIANTS OF A DESIGN
router.get("/design/:designId", getDesignVariants);

// CREATE PRODUCT VARIANT
router.post("/", createProductVariant);

// GET SINGLE PRODUCT
router.get("/:id", getProduct);

// UPDATE PRODUCT VARIANT
router.put("/:id", editProduct);

export default router;