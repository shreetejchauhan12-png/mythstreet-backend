import {
  getHomepageCollections,
  getTrendingDesigns,
  getLatestDrops,
  getBestSellers,
} from "../services/homepage.service.js";

// =====================================
// GET HOMEPAGE DATA
// =====================================

export const getHomepage = async (req, res) => {
  try {

    const [
      collections,
      trending,
      latestDrops,
      bestSellers,
    ] = await Promise.all([
      getHomepageCollections(),
      getTrendingDesigns(),
      getLatestDrops(),
      getBestSellers(),
    ]);

    return res.status(200).json({
      success: true,

      data: {
        collections,
        trending,
        latestDrops,
        bestSellers,
      },
    });

  } catch (error) {

    console.error(
      "GET HOMEPAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};