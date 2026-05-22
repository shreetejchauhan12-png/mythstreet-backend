import express from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.category,
        p.type,
        p.base_price as price,
p.design_id,
p.variant_code,
p.is_hero,
p.gender_visibility,
p.created_at,
d.collection,
        d.design,
        d.hero_type,
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
    res.status(500).json({ error: error.message });
  }
});

// ✅ NEW ARRIVALS
router.get("/new", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.category,
        p.type,
        p.base_price as price,
p.design_id,
p.variant_code,
p.is_hero,
p.gender_visibility,
p.created_at,
d.collection,
d.design,
d.hero_type,
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
    res.status(500).json({ error: error.message });
  }
});

// 🛒 ADD TO CART
router.post("/cart", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { product_id, size, title, price, image } = req.body;

    const existing = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1 AND product_id = $2 AND size = $3`,
      [userId, product_id, size] // ✅ FIXED
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE cart 
         SET quantity = quantity + 1 
         WHERE user_id = $1 AND product_id = $2 AND size = $3`,
        [userId, product_id, size] // ✅ FIXED
      );
    } else {
      await pool.query(
        `INSERT INTO cart (user_id, product_id, size, title, price, image, quantity)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [userId, product_id, size, title, price, image, 1]
      );
    }

    res.json({
      success: true,
      userId,
      product_id,
      size,
    });

  } catch (error) {
    console.error("🔥 CART ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🛒 GET USER CART (🔥 NEW IMPORTANT)
router.get("/cart", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const result = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1`,
      [userId]
    );

    res.json({ cart: result.rows });

  } catch (error) {
    console.error("🔥 GET CART ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});
// 🗑 REMOVE FROM CART
router.delete("/cart", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { product_id, size } = req.body;

    if (!product_id || !size) {
      return res.status(400).json({ error: "Missing product_id or size" });
    }

    await pool.query(
      `DELETE FROM cart 
       WHERE user_id = $1 AND product_id = $2 AND size = $3`,
      [userId, product_id, size]
    );

    res.json({ success: true });

  } catch (error) {
    console.error("🔥 DELETE CART ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});
// ➖ DECREASE QUANTITY
router.post("/cart/decrease", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { product_id, size } = req.body;

    // 1️⃣ decrease quantity
    await pool.query(
      `UPDATE cart 
       SET quantity = quantity - 1 
      WHERE user_id = $1 
AND product_id = $2 
AND (size = $3 OR (size IS NULL AND $3 IS NULL))`,
      [userId, product_id, size]
    );

    // 2️⃣ remove if quantity becomes 0
    await pool.query(
      `DELETE FROM cart 
       WHERE user_id = $1 
AND product_id = $2 
AND (size = $3 OR (size IS NULL AND $3 IS NULL)) AND quantity <= 0`,
      [userId, product_id, size]
    );

    res.json({ success: true });

  } catch (error) {
    console.error("🔥 DECREASE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});
// ❤️ ADD TO WISHLIST
router.post("/wishlist", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { product_id, title, price, image } = req.body;

    const existing = await pool.query(
      `SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2`,
      [userId, product_id]
    );

    if (existing.rows.length === 0) {
      await pool.query(
        `INSERT INTO wishlist (user_id, product_id, title, price, image)
         VALUES ($1,$2,$3,$4,$5)`,
        [userId, product_id, title, price, image]
      );
    }

    res.json({ success: true });

  } catch (err) {
    console.error("WISHLIST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ❤️ GET WISHLIST
router.get("/wishlist", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const result = await pool.query(
      `SELECT * FROM wishlist WHERE user_id = $1`,
      [userId]
    );

    res.json({ wishlist: result.rows });

  } catch (err) {
    console.error("GET WISHLIST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ❌ REMOVE FROM WISHLIST
router.delete("/wishlist", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { product_id } = req.body;

    await pool.query(
      `DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2`,
      [userId, product_id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("DELETE WISHLIST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
export default router;