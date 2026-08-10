import {
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import r2 from "../config/r2.js";

// =====================================
// UPLOAD TO R2
// =====================================

export async function uploadToR2({
  key,
  body,
  contentType,
}) {

  const command = new PutObjectCommand({

    Bucket:
      process.env.R2_BUCKET_NAME,

    Key: key,

    Body: body,

    ContentType: contentType,

  });

  await r2.send(command);

  return {

    success: true,

    key,

    url:
      `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${key}`,

  };

}

// =====================================
// DELETE FROM R2
// =====================================

export async function deleteFromR2(key) {

  if (!key) {
    return;
  }

  const command =
    new DeleteObjectCommand({

      Bucket:
        process.env.R2_BUCKET_NAME,

      Key: key,

    });

  await r2.send(command);

}