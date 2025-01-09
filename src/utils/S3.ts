import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import env from "./validateEnv";

const region = env.AWS_BUCKET_REGION_ID;
const accessKeyId = env.AWS_PUBLIC_KEY_ID;
const secretAccessKey = env.AWS_SECRET_KEY_ID;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error("AWS configuration variables are missing");
}

const client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export async function uploadFileS3(file: any): Promise<string> {
  if (!file.data || !file.name) {
    throw new Error("File data or file name is missing");
  }

  const uploadParams = {
    Bucket: env.AWS_BUCKET_NAME_ID,
    Key: file.name, // Nombre del archivo en el bucket
    Body: file.data, // Usamos el buffer directamente
    ContentType: file.mimetype, // Tipo de contenido para el archivo
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await client.send(command);

    // Generar la URL del archivo
    const bucketUrl = `https://${env.AWS_BUCKET_NAME_ID}.s3.${region}.amazonaws.com/${file.name}`;
    return bucketUrl;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(`Failed to upload file to S3: ${error}`);
  }
}
