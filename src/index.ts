import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from "dotenv";
import rootRouter from "./routes/index.ts";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errors.ts";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";


dotenv.config();
const app: Express = express();
const PORT = 3001

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use(cors(
  {origin: "http://localhost:3000", methods:"GET,POST,HEAD,PUT,DELETE,OPTIONS",credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],},
));
app.use('/api',rootRouter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware)

app.listen(PORT, async () => {
  console.log(`my name is priyank ${PORT}`);
});