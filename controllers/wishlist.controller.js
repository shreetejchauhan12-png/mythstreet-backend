import pool from "../config/db.js";

// =====================================
// GET WISHLIST
// =====================================

export const getWishlist = async (req, res) => {

  try {

    const userId = req.user.id;

    const result = await pool.query(

      `
      SELECT
        id,
        product_id,
        title,
        image,
        price
      FROM wishlist
      WHERE user_id = $1
      ORDER BY id DESC
      `,

      [userId]

    );

    return res.json({

      success: true,

      wishlist: result.rows,

    });

  } catch (error) {

  console.error("GET WISHLIST ERROR:", error);

  return res.status(500).json({

    success: false,

    message: error.message,

    error,

  });

}

};

// =====================================
// ADD TO WISHLIST
// =====================================

export const addWishlist = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      product_id,
      title,
      image,
      price,
    } = req.body;

    const exists = await pool.query(

      `
      SELECT id
      FROM wishlist
      WHERE
        user_id = $1
        AND product_id = $2
      `,

      [
        userId,
        product_id,
      ]

    );

    if (exists.rows.length === 0) {

      await pool.query(

        `
        INSERT INTO wishlist
        (
          user_id,
          product_id,
          title,
          image,
          price
        )
        VALUES
        (
          $1,$2,$3,$4,$5
        )
        `,

        [
          userId,
          product_id,
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

    console.error(
      "ADD WISHLIST ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Failed to add wishlist",

    });

  }

};

// =====================================
// REMOVE FROM WISHLIST
// =====================================

export const removeWishlist = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      product_id,
    } = req.body;

    await pool.query(

      `
      DELETE FROM wishlist
      WHERE
        user_id = $1
        AND product_id = $2
      `,

      [
        userId,
        product_id,
      ]

    );

    return res.json({

      success: true,

    });

  } catch (error) {

    console.error(
      "REMOVE WISHLIST ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Failed to remove wishlist",

    });

  }

};