import express from "express";

import {
  getDesigns,
  addDesign,
  getDesignById,
} from "../controllers/designs.controller.js";

const router = express.Router();

// =====================================
// GET ALL DESIGNS
// =====================================

router.get("/", getDesigns);
router.get("/:id", getDesignById);

// =====================================
// CREATE DESIGN
// =====================================

router.post("/", addDesign);

export default router;
