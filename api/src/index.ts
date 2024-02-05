import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import apiRouter from "./api.router";
import corsMiddleware from './common/config/cors'
dotenv.config(); 

const app = express();
const port = process.env.PORT;


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(corsMiddleware)
app.use("/api", apiRouter)



app.listen(port, () => {
  console.log("Server is running on port", port);
});