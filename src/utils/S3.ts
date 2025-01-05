import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import env from "./validateEnv";


const region = env.AWS_BUCKET_REGION_ID;
const accessKeyId = env.AWS_PUBLIC_KEY_ID;
const secretAccessKey = env.AWS_SECRET_KEY_ID;

// Verifica que las variables no sean undefined
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
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.name, // Nombre del archivo en el bucket
      Body: fs.createReadStream(file.tempFilePath),
    };
  
    try {
      const command = new PutObjectCommand(uploadParams);
      await client.send(command);
  
      // Generar la URL permanente
      const bucketUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${file.name}`;
  
      // Eliminar el archivo temporal
      fs.unlinkSync(file.tempFilePath);
  
      return bucketUrl;
    } catch (error) {
      // En caso de error, eliminar también el archivo temporal
      fs.unlinkSync(file.tempFilePath);
      throw error;
    }
  }
  