export function generateFilename({
  designSlug,
  garmentCode,
  colorCode,
  imageTypeCode,
  sequenceNumber,
  extension,
}) {

  return [
    designSlug,
    garmentCode,
    colorCode,
    `${imageTypeCode}-${sequenceNumber}`,
  ].join("-") + extension;

}