import {
  getAllProductsV2,
  getProductByIdV2,
} from "../repositories/products-v2.repository.js";

// =====================================
// BUILD MEDIA OBJECT
// =====================================

function buildImages(assets = []) {

  const images = {
    main: null,
    front: null,
    back: null,
    left: null,
    right: null,
    close_up: null,
    lifestyle: null,
    gallery: [],
  };

  for (const asset of assets) {

    switch (asset.image_code) {

      // =====================================
      // MAIN GALLERY
      // =====================================

      case "mg":

        if (!images.main) {
          images.main = asset.url;
        }

        images.gallery.push(asset.url);

        break;


      // =====================================
      // FRONT
      // =====================================

      case "f":

        if (!images.front) {
          images.front = asset.url;
        }

        break;


      // =====================================
      // BACK
      // =====================================

      case "b":

        if (!images.back) {
          images.back = asset.url;
        }

        break;


      // =====================================
      // LEFT
      // =====================================

      case "l":

        if (!images.left) {
          images.left = asset.url;
        }

        break;


      // =====================================
      // RIGHT
      // =====================================

      case "r":

        if (!images.right) {
          images.right = asset.url;
        }

        break;


      // =====================================
      // CLOSE UP
      // =====================================

      case "cu":

        if (!images.close_up) {
          images.close_up = asset.url;
        }

        break;


      // =====================================
      // LIFESTYLE
      // =====================================

      case "ls":

        if (!images.lifestyle) {
          images.lifestyle = asset.url;
        }

        break;

    }

  }

  return images;

}


// =====================================
// GET ALL PRODUCTS (V2)
// =====================================

export async function getProductsV2() {

  const products =
    await getAllProductsV2();

  return products.map((product) => ({

    ...product,

    images:
      buildImages(product.assets),

  }));

}


// =====================================
// GET SINGLE PRODUCT (V2)
// =====================================

export async function getProductV2ById(id) {

  const product =
    await getProductByIdV2(id);

  if (!product) {

    return null;

  }

  return {

    ...product,

    images:
      buildImages(product.assets),

  };

}