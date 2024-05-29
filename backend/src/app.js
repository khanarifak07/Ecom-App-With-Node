import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

//configuring cors middleware (app.use)
app.use(cors({ credentials: true, origin: "*" }));
//configurin cookie-parser
app.use(cookieParser());
//json configuration via express
app.use(express.json({ limit: "16kb" }));
//url configuration via express
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//asset configuration for files, pdfs, image, etc
app.use(express.static("public"));

export { app };
