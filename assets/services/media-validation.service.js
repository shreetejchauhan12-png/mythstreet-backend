import path from "path";
import { fileTypeFromFile } from "file-type";

// =====================================
// ALLOWED MEDIA TYPES
// =====================================

const ALLOWED_MEDIA = {

  // ================================
  // IMAGES
  // ================================

  jpg: {
    mime: "image/jpeg",
    extensions: ["jpg", "jpeg"],
  },

  png: {
    mime: "image/png",
    extensions: ["png"],
  },

  webp: {
    mime: "image/webp",
    extensions: ["webp"],
  },

  gif: {
    mime: "image/gif",
    extensions: ["gif"],
  },

  // ================================
  // VIDEOS
  // ================================

  mp4: {
    mime: "video/mp4",
    extensions: ["mp4"],
  },

  webm: {
    mime: "video/webm",
    extensions: ["webm"],
  },

  mov: {
    mime: "video/quicktime",
    extensions: ["mov"],
  },

};

// =====================================
// VALIDATE MEDIA FILE
// =====================================

export async function validateMediaFile(
  file
) {

  if (!file) {
    throw new Error(
      "No media file provided."
    );
  }

  if (!file.path) {
    throw new Error(
      "Media file path is missing."
    );
  }

  // =================================
  // ORIGINAL EXTENSION
  // =================================

  const originalExtension =
    path
      .extname(file.originalname)
      .replace(".", "")
      .toLowerCase();

  // =================================
  // DETECT ACTUAL FILE TYPE
  // =================================

  const detected =
    await fileTypeFromFile(
      file.path
    );

  if (!detected) {

    throw new Error(
      `Unable to detect actual file type: ${file.originalname}`
    );

  }

  console.log(
    "🔍 MEDIA VALIDATION"
  );

  console.log(
    "Original Name :",
    file.originalname
  );

  console.log(
    "Declared MIME :",
    file.mimetype
  );

  console.log(
    "Extension     :",
    originalExtension
  );

  console.log(
    "Detected Ext  :",
    detected.ext
  );

  console.log(
    "Detected MIME :",
    detected.mime
  );

  // =================================
  // CHECK DETECTED MIME
  // =================================

  const mediaDefinition =
    Object.values(
      ALLOWED_MEDIA
    ).find(
      (media) =>
        media.mime ===
        detected.mime
    );

  if (!mediaDefinition) {

    throw new Error(
      `Unsupported actual media type: ${detected.mime}`
    );

  }

  // =================================
  // CHECK EXTENSION
  // =================================

  const extensionMatches =
    mediaDefinition.extensions.includes(
      originalExtension
    );

  if (!extensionMatches) {

    throw new Error(
      `File extension does not match actual file type. ` +
      `Received .${originalExtension}, ` +
      `detected ${detected.mime}.`
    );

  }

  // =================================
  // NORMALIZE MIME
  // =================================

  file.mimetype =
    mediaDefinition.mime;

  // =================================
  // RETURN VERIFIED TYPE
  // =================================

  return {

    extension:
      originalExtension,

    detectedExtension:
      detected.ext,

    mimeType:
      mediaDefinition.mime,

    detectedMime:
      detected.mime,

  };

}
