import {
  getGarmentTypes,
  getColors,
  getSizes,
} from "../services/lookups.service.js";

// =====================================
// GARMENT TYPES
// =====================================

export const garmentTypes = async (req, res) => {
  try {
    const data = await getGarmentTypes();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET GARMENT TYPES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =====================================
// COLORS
// =====================================

export const colors = async (req, res) => {
  try {
    const data = await getColors();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET COLORS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =====================================
// SIZES
// =====================================

export const sizes = async (req, res) => {
  try {
    const data = await getSizes();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET SIZES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};