import {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../services/collections.service.js";

// =====================================
// GET ALL COLLECTIONS
// =====================================

export const getCollections = async (req, res) => {
  try {

    const collections = await getAllCollections();

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

// =====================================
// GET COLLECTION BY ID
// =====================================

export const getCollection = async (req, res) => {
  try {

    const { id } = req.params;

    const collection =
      await getCollectionById(id);

    if (!collection) {

      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });

    }

    return res.status(200).json({
      success: true,
      data: collection,
    });

  } catch (error) {

    console.error(
      "GET COLLECTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =====================================
// CREATE COLLECTION
// =====================================

export const addCollection = async (req, res) => {
  try {

    const { name } = req.body;

    if (!name?.trim()) {

      return res.status(400).json({
        success: false,
        message: "Collection name is required.",
      });

    }

    const collection =
      await createCollection({
        name,
      });

    return res.status(201).json({
      success: true,
      data: collection,
      message: "Collection created successfully.",
    });

  } catch (error) {

    console.error(
      "CREATE COLLECTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// UPDATE COLLECTION
// =====================================

export const editCollection = async (req, res) => {
  try {

    const { id } = req.params;

    const { name } = req.body;

    const collection =
      await updateCollection(
        id,
        { name }
      );

    if (!collection) {

      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });

    }

    return res.status(200).json({
      success: true,
      data: collection,
      message: "Collection updated successfully.",
    });

  } catch (error) {

    console.error(
      "UPDATE COLLECTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// DELETE COLLECTION
// =====================================

export const removeCollection = async (req, res) => {
  try {

    const { id } = req.params;

    const collection =
      await deleteCollection(id);

    if (!collection) {

      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });

    }

    return res.status(200).json({
      success: true,
      message: "Collection deleted successfully.",
    });

  } catch (error) {

    console.error(
      "DELETE COLLECTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};