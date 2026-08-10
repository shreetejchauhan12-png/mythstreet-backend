import express from "express";

import upload from "../../assets/middleware/upload.middleware.js";

import {
  createProduct,
} from "../controllers/admin-product.controller.js";

const router = express.Router();

// =====================================
// CREATE COMPLETE PRODUCT
// =====================================

router.post(
  "/products",
  upload.fields([
    { name: "main", maxCount: 10 },
    { name: "front", maxCount: 10 },
    { name: "back", maxCount: 10 },
    { name: "left", maxCount: 10 },
    { name: "right", maxCount: 10 },
    { name: "close_up", maxCount: 10 },
    { name: "lifestyle", maxCount: 10 },
  ]),
  createProduct
);

export default router;