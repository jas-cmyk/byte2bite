import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CORS_ORIGIN } from "./config.js";
import { reservationsRouter } from "./routes/index.js";

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "public");

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(cors({ origin: CORS_ORIGIN }));
  app.use(express.json());
  app.use(reservationsRouter);
  app.use(express.static(publicDir));

  app.use((err, req, res, next) => {
    const status = err.status && err.status < 500 ? err.status : 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ error: status >= 500 ? "Internal Server Error" : err.message });
  });

  return app;
}