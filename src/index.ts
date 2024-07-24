import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/db";
import bodyParser from "body-parser";
import cors from "cors";
import { setupSwagger } from "./swagger";
import stationRoutes from "./routes/stationRoutes";
import authenticationMiddleware from "./middleware/authenticationMiddleware";
import {TOKEN_SAMPLE} from "../generateTokenTest";

dotenv.config();

const app: Express = express();

const corsOptions = {
  origin: '*',
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Content-Length',
    'Accept-Encoding',
    'X-CSRF-Token',
    'Authorization',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-Requested-With'
  ],
  methods: ['POST', 'OPTIONS', 'GET', 'PUT']
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(authenticationMiddleware)

console.log(TOKEN_SAMPLE)


const port = process.env.PORT || 3000;
connectDatabase();

app.use(bodyParser.json());
app.use("/api", stationRoutes);

setupSwagger(app);

app.get("/", (req: Request, res: Response) => {
  res.send("Auto sense backend");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
