import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from "dotenv";
import rootRouter from "./routes/index.ts";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errors.ts";
import bodyParser from "body-parser";


dotenv.config();
const app: Express = express();
const PORT = 3001
app.use(express.json());
app.use(bodyParser.urlencoded());

app.use(cors(
  {origin: "*", methods:"GET,POST,HEAD,PUT"}

));
app.use('/api',rootRouter);

app.use(errorMiddleware)

app.listen(PORT, async () => {
  console.log(`my name is priyank ${PORT}`);
});