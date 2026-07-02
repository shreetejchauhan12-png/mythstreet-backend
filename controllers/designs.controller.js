import { getAllDesigns } from "../services/designs.service.js";

export const getDesigns = async (req, res) => {
  try {
    const designs = await getAllDesigns();

    return res.status(200).json({
      success: true,
      data: designs,
    });

  } catch (error) {
    console.error("GET DESIGNS CONTROLLER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};