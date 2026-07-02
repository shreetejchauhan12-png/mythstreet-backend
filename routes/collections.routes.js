import express from "express";

import {
  getCollections,
} from "../controllers/collections.controller.js";

const router = express.Router();

// =====================================
// COLLECTIONS
// =====================================

// GET ALL COLLECTIONS
router.get("/", getCollections);

export default router;
