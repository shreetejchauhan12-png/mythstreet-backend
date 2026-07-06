import express from "express";

import auth from "../middleware/auth.js";

console.log("✅ PRODUCTS ROUTES FILE LOADED");

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

import {
  getWishlist,
  addWishlist,
  removeWishlist,
} from "../controllers/wishlist.controller.js";

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
// WISHLIST
// =====================================

router.get(
  "/wishlist",
  auth,
  getWishlist
);

router.post(
  "/wishlist",
  auth,
  addWishlist
);

router.delete(
  "/wishlist",
  auth,
  removeWishlist
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
router.get("/:id", (req, res, next) => {

  console.log("GET PRODUCT ROUTE HIT:", req.params.id);

  return getProduct(req, res, next);

});

// UPDATE PRODUCT VARIANT
router.put("/:id", editProduct);

export default router;