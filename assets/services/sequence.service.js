import { getMaxSequence } from "../repositories/asset.repository.js";

// =====================================
// GET NEXT SEQUENCE
// =====================================

export async function getNextSequence({
  client,
  productVariantId,
  garmentTypeId,
  colorId,
  imageTypeId,
}) {

  const currentSequence =
    await getMaxSequence({

      client,

      productVariantId,

      garmentTypeId,

      colorId,

      imageTypeId,

    });

  const nextSequence =
    currentSequence + 1;

  return String(nextSequence).padStart(3, "0");

}