import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ✅ GET ALL PRODUCTS (USED FOR TRENDING, SHOP, ETC.)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.category,
        p.type,
        p.base_price as price,
        p.created_at,
        d.collection,
        d.design,
        i.image,
        i.hover_left,
        i.hover_right,
        i.banner
      FROM products p
      LEFT JOIN designs d ON p.design_id = d.id
      LEFT JOIN product_images i ON i.product_id = p.id
      ORDER BY p.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("🔥 PRODUCTS API ERROR:");
    console.error(error.message);
    console.error(error.stack);

    res.status(500).json({ error: error.message });
  }
});

// ✅ NEW ARRIVALS (TOP 10 LATEST)
router.get("/new", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.category,
        p.type,
        p.base_price as price,
        p.created_at,
        d.collection,
        i.image,
        i.hover_left,
        i.hover_right,
        i.banner
      FROM products p
      LEFT JOIN designs d ON p.design_id = d.id
      LEFT JOIN product_images i ON i.product_id = p.id
      ORDER BY p.created_at DESC
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("🔥 NEW PRODUCTS API ERROR:");
    console.error(error.message);
    console.error(error.stack);

    res.status(500).json({ error: error.message });
  }
});

export default router;