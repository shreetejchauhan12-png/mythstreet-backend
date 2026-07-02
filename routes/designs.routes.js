import express from "express";

import {
  getDesigns,
  addDesign,
} from "../controllers/designs.controller.js";

const router = express.Router();

// =====================================
// GET ALL DESIGNS
// =====================================

router.get("/", getDesigns);

// =====================================
// CREATE DESIGN
// =====================================

router.post("/", addDesign);

export default router;
