import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";

dotenv.config(); // Cargar el archivo .env

export default cleanEnv(process.env, {
  MONGODB_URI: str(),
  PORT: port(),
  AWS_BUCKET_NAME: str(),
  AWS_BUCKET_REGION: str(),
  AWS_PUBLIC_KEY: str(),
  AWS_SECRET_KEY: str(),
  AUTH_SECRET: str(),
  AUTH_CLIENT: str(),
});
