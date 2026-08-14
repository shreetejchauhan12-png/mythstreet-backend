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
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await r2.send(command);

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  return {
    success: true,
    key,
    url: publicUrl,
  };
}

// =====================================
// DELETE FROM R2
// =====================================

export async function deleteFromR2(key) {
  if (!key) {
    return;
  }

  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  await r2.send(command);
}