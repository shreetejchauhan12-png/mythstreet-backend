import {
  getAllDesigns,
  createDesign,
  getDesignById as getDesignByIdService,
} from "../services/designs.service.js";

// =====================================
// GET ALL DESIGNS
// =====================================

export const getDesigns = async (req, res) => {
  try {

    const designs =
      await getAllDesigns();

    return res.status(200).json({
      success: true,
      data: designs,
    });

  } catch (error) {

    console.error(
      "GET DESIGNS CONTROLLER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =====================================
// GET DESIGN BY ID
// =====================================

export const getDesignById = async (req, res) => {
  try {

    const design =
      await getDesignByIdService(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: design,
    });

  } catch (error) {

    console.error(
      "GET DESIGN BY ID ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// =====================================
// CREATE DESIGN
// =====================================

export const addDesign = async (req, res) => {
  try {

    const design =
      await createDesign(req.body);

    return res.status(201).json({
      success: true,
      data: design,
    });

  } catch (error) {

    console.error(
      "CREATE DESIGN CONTROLLER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};