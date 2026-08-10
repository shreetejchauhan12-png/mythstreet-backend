import express from "express";

import {
  getAllProductsV2Controller,
  getProductV2ByIdController,
} from "../controllers/products-v2.controller.js";

const router = express.Router();

// =====================================
// GET ALL PRODUCTS (V2)
// =====================================

router.get(
  "/",
  getAllProductsV2Controller
);

// =====================================
// GET SINGLE PRODUCT (V2)
// =====================================

router.get(
  "/:id",
  getProductV2ByIdController
);

export default router;