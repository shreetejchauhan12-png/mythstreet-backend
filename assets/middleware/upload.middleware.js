import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = "uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

// =====================================
// MIME TYPE NORMALIZATION
// =====================================

function getMimeTypeFromExtension(
  filename
) {

  const extension =
    path.extname(filename)
      .toLowerCase();

  const mimeTypes = {

    // ================================
    // IMAGES
    // ================================

    ".jpg":
      "image/jpeg",

    ".jpeg":
      "image/jpeg",

    ".png":
      "image/png",

    ".webp":
      "image/webp",

    ".gif":
      "image/gif",

    // ================================
    // VIDEOS
    // ================================

    ".mp4":
      "video/mp4",

    ".webm":
      "video/webm",

    ".mov":
      "video/quicktime",

  };

  return mimeTypes[extension] || null;

}

// =====================================
// STORAGE
// =====================================

const storage =
  multer.diskStorage({

    destination(
      req,
      file,
      cb
    ) {

      cb(
        null,
        uploadPath
      );

    },

    filename(
      req,
      file,
      cb
    ) {

      const uniqueName =
        Date.now() +
        "-" +
        Math.round(
          Math.random() * 1e9
        ) +
        path.extname(
          file.originalname
        );

      cb(
        null,
        uniqueName
      );

    },

  });

// =====================================
// FILE FILTER
// =====================================

const fileFilter =
  (
    req,
    file,
    cb
  ) => {

    console.log(
      "\n=============================="
    );

    console.log(
      "📂 FILE RECEIVED"
    );

    console.log(
      "=============================="
    );

    console.log(
      "Original Name :",
      file.originalname
    );

    console.log(
      "Client MIME   :",
      file.mimetype
    );

    console.log(
      "Extension     :",
      path.extname(
        file.originalname
      )
    );

    console.log(
      "==============================\n"
    );

    // =================================
    // NORMALIZE MIME TYPE
    // =================================

    const extensionMimeType =
      getMimeTypeFromExtension(
        file.originalname
      );

    // =================================
    // CLIENT SENT CORRECT MIME
    // =================================

    const validClientMimeTypes = [

      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",

      "video/mp4",
      "video/webm",
      "video/quicktime",

    ];

    if (
      validClientMimeTypes.includes(
        file.mimetype
      )
    ) {

      // Normalize image/jpg
      // to standard image/jpeg

      if (
        file.mimetype ===
        "image/jpg"
      ) {

        file.mimetype =
          "image/jpeg";

      }

      console.log(
        "✅ MIME accepted:",
        file.mimetype
      );

      return cb(
        null,
        true
      );

    }

    // =================================
    // CLIENT SENT OCTET-STREAM
    // =================================
    // Some clients don't correctly
    // identify WEBP and other files.

    if (
      file.mimetype ===
      "application/octet-stream"
    ) {

      if (
        extensionMimeType
      ) {

        file.mimetype =
          extensionMimeType;

        console.log(
          "🔄 MIME normalized:",
          "application/octet-stream",
          "→",
          file.mimetype
        );

        return cb(
          null,
          true
        );

      }

      console.log(
        "❌ Unknown file extension:",
        path.extname(
          file.originalname
        )
      );

      return cb(
        new Error(
          "Unsupported file type."
        ),
        false
      );

    }

    // =================================
    // UNSUPPORTED MIME
    // =================================

    console.log(
      "❌ Unsupported MIME Type:",
      file.mimetype
    );

    return cb(
      new Error(
        "Unsupported file type."
      ),
      false
    );

  };

// =====================================
// MULTER
// =====================================

const upload =
  multer({

    storage,

    fileFilter,

    limits: {

      fileSize:
        100 *
        1024 *
        1024,

    },

  });

export default upload;