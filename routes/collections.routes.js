import express from "express";

import {
  getCollections,
  getCollection,
  addCollection,
  editCollection,
  removeCollection,
} from "../controllers/collections.controller.js";

const router = express.Router();

// =====================================
// COLLECTIONS
// =====================================

// GET ALL COLLECTIONS
router.get("/", getCollections);

// GET SINGLE COLLECTION
router.get("/:id", getCollection);

// CREATE COLLECTION
router.post("/", addCollection);

// UPDATE COLLECTION
router.put("/:id", editCollection);

// DELETE COLLECTION
router.delete("/:id", removeCollection);

export default router;