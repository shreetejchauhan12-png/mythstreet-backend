import express from "express";

import {
  getAssetsByVariant,
} from "../controllers/asset.controller.js";

const router = express.Router();

// =====================================
// GET ALL ASSETS OF A PRODUCT VARIANT
// =====================================

router.get(
  "/product/:variantId",
  getAssetsByVariant
);

export default router;