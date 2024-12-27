import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/user"
import cors from "cors"
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import "dotenv/config";
import swaggerUI from "swagger-ui-express";
import specs from "../swagger/swagger";


const app = express();

app.use(express.json());
app.use(
  cors()
);


app.use(morgan("dev"));



app.use("/api", userRoutes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use((req,res,next)=>{
  next(createHttpError(404,"Endpoint not found"))
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error:unknown,req:Request, res:Response, next: NextFunction)=>{
  console.error(error)
  let errorMessage =" An Unknown error ocurred";
  let statusCode=500;
  if (isHttpError(error)){
      statusCode=error.status
      errorMessage=error.message;
  } 
  res.status(statusCode).json({error:errorMessage})
})
export default app

