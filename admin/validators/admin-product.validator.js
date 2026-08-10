// =====================================
// ADMIN PRODUCT VALIDATION
// =====================================

export function validateCreateProduct(data) {

  const errors = [];

  // =====================================
  // DESIGN
  // =====================================

  if (!data.design) {

    errors.push(
      "Design information is required."
    );

  } else {

    if (!data.design.name?.trim()) {

      errors.push(
        "Design name is required."
      );

    }

    if (!data.design.slug?.trim()) {

      errors.push(
        "Design slug is required."
      );

    }

    if (
      !Number.isInteger(
        Number(data.design.collectionId)
      ) ||
      Number(data.design.collectionId) <= 0
    ) {

      errors.push(
        "Valid collectionId is required."
      );

    }

  }

  // =====================================
  // VARIANT
  // =====================================

  if (!data.variant) {

    errors.push(
      "Variant information is required."
    );

  } else {

    if (
      !Number.isInteger(
        Number(data.variant.garmentTypeId)
      ) ||
      Number(data.variant.garmentTypeId) <= 0
    ) {

      errors.push(
        "Valid garmentTypeId is required."
      );

    }

    if (
      !Number.isInteger(
        Number(data.variant.colorId)
      ) ||
      Number(data.variant.colorId) <= 0
    ) {

      errors.push(
        "Valid colorId is required."
      );

    }

    if (
      !Number.isFinite(
        Number(data.variant.price)
      ) ||
      Number(data.variant.price) < 0
    ) {

      errors.push(
        "Valid product price is required."
      );

    }

    if (
      data.variant.displayOrder !== undefined &&
      (
        !Number.isInteger(
          Number(data.variant.displayOrder)
        ) ||
        Number(data.variant.displayOrder) < 0
      )
    ) {

      errors.push(
        "displayOrder must be a non-negative integer."
      );

    }

  }

  // =====================================
  // SIZES
  // =====================================

  if (
    !Array.isArray(data.sizeIds)
  ) {

    errors.push(
      "sizeIds must be an array."
    );

  } else {

    for (
      const sizeId of data.sizeIds
    ) {

      if (
        !Number.isInteger(
          Number(sizeId)
        ) ||
        Number(sizeId) <= 0
      ) {

        errors.push(
          "Every sizeId must be a valid positive integer."
        );

        break;

      }

    }

  }

  // =====================================
  // FILES
  // =====================================

  if (
    !Array.isArray(data.files)
  ) {

    errors.push(
      "Files must be an array."
    );

  } else {

    for (
      const fileData of data.files
    ) {

      if (!fileData.file) {

        errors.push(
          "Invalid uploaded file."
        );

        break;

      }

      if (
        !fileData.imageTypeCode
      ) {

        errors.push(
          `Image type is missing for ${fileData.file.originalname}.`
        );

        break;

      }

    }

  }

  // =====================================
  // RESULT
  // =====================================

  return {

    valid:
      errors.length === 0,

    errors,

  };

}