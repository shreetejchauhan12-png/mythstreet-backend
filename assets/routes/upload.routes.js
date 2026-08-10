import express from "express";

import upload from "../middleware/upload.middleware.js";
import { uploadAsset } from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/",
  upload.single("file"),
  uploadAsset
);

export default router;