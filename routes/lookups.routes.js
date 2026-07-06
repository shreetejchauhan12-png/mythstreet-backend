import express from "express";

import {
  garmentTypes,
  colors,
  sizes,
} from "../controllers/lookups.controller.js";

const router = express.Router();

// =====================================
// LOOKUPS
// =====================================

router.get("/garment-types", garmentTypes);

router.get("/colors", colors);

router.get("/sizes", sizes);

export default router;