import pool from "../config/db.js";

// =====================================
// GET CART
// =====================================

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        id,
        product_id,
        quantity,
        size,
        title,
        image,
        price
      FROM cart
      WHERE user_id = $1
      ORDER BY id DESC
      `,
      [userId]
    );

    return res.json({
      success: true,
      cart: result.rows,
    });

  } catch (error) {

    console.error("GET CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });

  }
};

// =====================================
// ADD TO CART
// =====================================

export const addToCart = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      product_id,
      quantity = 1,
      size,
      title,
      image,
      price,
    } = req.body;

    const existing = await pool.query(

      `
      SELECT *
      FROM cart
      WHERE
        user_id = $1
        AND product_id = $2
        AND COALESCE(size,'') = COALESCE($3,'')
      `,

      [
        userId,
        product_id,
        size,
      ]

    );

    if (existing.rows.length > 0) {

      await pool.query(

        `
        UPDATE cart
        SET quantity = quantity + $1
        WHERE id = $2
        `,

        [
          quantity,
          existing.rows[0].id,
        ]

      );

    } else {

      await pool.query(

        `
        INSERT INTO cart
        (
          user_id,
          product_id,
          quantity,
          size,
          title,
          image,
          price
        )
        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7
        )
        `,

        [
          userId,
          product_id,
          quantity,
          size,
          title,
          image,
          price,
        ]

      );

    }

    return res.json({
      success: true,
    });

  } catch (error) {

    console.error("ADD CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add cart",
    });

  }

};

// =====================================
// DECREASE QTY
// =====================================

export const decreaseCart = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      product_id,
      size,
    } = req.body;

    const result = await pool.query(

      `
      SELECT *
      FROM cart
      WHERE
        user_id = $1
        AND product_id = $2
        AND COALESCE(size,'') = COALESCE($3,'')
      `,

      [
        userId,
        product_id,
        size,
      ]

    );

    if (result.rows.length === 0) {

      return res.json({
        success: true,
      });

    }

    const item = result.rows[0];

    if (item.quantity <= 1) {

      await pool.query(

        `
        DELETE FROM cart
        WHERE id = $1
        `,

        [item.id]

      );

    } else {

      await pool.query(

        `
        UPDATE cart
        SET quantity = quantity - 1
        WHERE id = $1
        `,

        [item.id]

      );

    }

    return res.json({
      success: true,
    });

  } catch (error) {

    console.error("DECREASE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to decrease quantity",
    });

  }

};

// =====================================
// REMOVE ITEM
// =====================================

export const removeCartItem = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      product_id,
      size,
    } = req.body;

    await pool.query(

      `
      DELETE FROM cart
      WHERE
        user_id = $1
        AND product_id = $2
        AND COALESCE(size,'') = COALESCE($3,'')
      `,

      [
        userId,
        product_id,
        size,
      ]

    );

    return res.json({
      success: true,
    });

  } catch (error) {

    console.error("REMOVE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove item",
    });

  }

};