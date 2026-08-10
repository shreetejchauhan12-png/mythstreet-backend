// =====================================
// MAP ASSETS TO LEGACY RESPONSE
// =====================================

export function mapAssetsToLegacyResponse(assets) {

  const response = {

    main_image: null,

    image_2: null,

    image_3: null,

    image_4: null,

    image_5: null,

    image_6: null,

    banner_image: null,

  };

  for (const asset of assets) {

    switch (asset.image_type_code) {

      case "mg":
        response.main_image = asset.file_url;
        break;

      case "g2":
        response.image_2 = asset.file_url;
        break;

      case "g3":
        response.image_3 = asset.file_url;
        break;

      case "g4":
        response.image_4 = asset.file_url;
        break;

      case "g5":
        response.image_5 = asset.file_url;
        break;

      case "g6":
        response.image_6 = asset.file_url;
        break;

      case "bn":
        response.banner_image = asset.file_url;
        break;

    }

  }

  return response;

}