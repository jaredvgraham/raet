import s3 from "../config/aws";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const uploadImagesBucket = async (
  files: Express.Multer.File[]
): Promise<string[]> => {
  const uploadPromises = files.map((file) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return s3.upload(params).promise();
  });

  const uploadedFiles = await Promise.all(uploadPromises);
  return uploadedFiles.map((file) => file.Location);
};
