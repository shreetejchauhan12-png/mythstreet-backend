import {
  getAllCollections,
} from "../services/collections.service.js";

// =====================================
// GET ALL COLLECTIONS
// =====================================

export const getCollections = async (req, res) => {
  try {

    const collections =
      await getAllCollections();

    return res.status(200).json({
      success: true,
      data: collections,
    });

  } catch (error) {

    console.error(
      "GET COLLECTIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};
