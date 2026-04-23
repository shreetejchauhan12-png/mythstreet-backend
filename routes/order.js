import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import pool from "../config/db.js";
import auth from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ CREATE ORDER
router.post("/", async (req, res) => {
  try {
    // 🔐 GET USER FROM TOKEN
const token = req.headers.authorization?.split(" ")[1];

if (!token) {
  return res.status(401).json({ error: "Unauthorized" });
}

const decoded = jwt.verify(token, process.env.JWT_SECRET);
const userId = decoded.id;
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMethod,
      items,
      amount,
    } = req.body;

    const orderResult = await pool.query(
      `
      INSERT INTO orders 
(user_id, name, phone, email, address, city, state, pincode, payment_method, total_amount)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id
    `,
      [
        userId,
        name,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        paymentMethod,
        amount,
      ]
    );

    const orderId = orderResult.rows[0].id;

    // SAVE ITEMS
    for (const item of items) {
      const productId = parseInt(String(item.id).split("-")[0]);

      await pool.query(
        `
        INSERT INTO order_items
        (order_id, product_id, title, price, quantity, size, image)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
      `,
        [
          orderId,
          productId,
          item.title,
          item.price,
          item.quantity,
          item.size || "",
          item.image || "",
        ]
      );
    }

    // ONLINE PAYMENT
    if (paymentMethod === "online") {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const razorOrder = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: "order_" + orderId,
      });

      return res.json({
        success: true,
        orderId,
        razorpay: razorOrder,
      });
    }

    // COD
    return res.json({
      success: true,
      orderId,
      message: "Order placed with COD",
    });

  } catch (error) {
    console.error("🔥 ORDER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔥 VERIFY PAYMENT
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      await pool.query(
        `UPDATE orders SET payment_status = 'paid' WHERE id = $1`,
        [orderId]
      );

      return res.json({ success: true });
    } else {
      await pool.query(
        `UPDATE orders SET payment_status = 'failed' WHERE id = $1`,
        [orderId]
      );

      return res.status(400).json({ success: false });
    }

  } catch (error) {
    console.error("🔥 VERIFY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ UPDATE STATUS (ADMIN)  ← IMPORTANT: placed BEFORE :id
router.put("/:id/status", async (req, res) => {
  try {
    const orderId = req.params.id;
const { status } = req.body;

// update status
await pool.query(
  `UPDATE orders SET status = $1 WHERE id = $2`,
  [status, orderId]
);

// 🔥 AUTO PAYMENT FOR COD
if (status === "delivered") {
  const result = await pool.query(
    `SELECT payment_method FROM orders WHERE id = $1`,
    [orderId]
  );

  const paymentMethod = result.rows[0].payment_method;

  if (paymentMethod === "cod") {
    await pool.query(
      `UPDATE orders SET payment_status = 'paid' WHERE id = $1`,
      [orderId]
    );
  }
}

res.json({ success: true });

  } catch (error) {
    console.error("🔥 UPDATE STATUS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET ORDER BY ID
router.get("/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [orderId]
    );

    res.json({
      order,
      items: itemsResult.rows,
    });

  } catch (error) {
    console.error("🔥 GET ORDER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET ALL ORDERS (FINAL CLEAN)
router.get("/", async (req, res) => {
  try {
    // 🔐 GET TOKEN
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ ONLY THIS USER'S ORDERS
    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC`,
      [decoded.id]
    );

    const orders = result.rows;

    for (let order of orders) {
      const itemsResult = await pool.query(
        `SELECT * FROM order_items WHERE order_id = $1`,
        [order.id]
      );
      order.items = itemsResult.rows;
    }

    res.json({ orders });

  } catch (error) {
    console.error("🔥 GET USER ORDERS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;