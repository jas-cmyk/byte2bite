import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const PORT = Number(process.env.PORT || 3000);
export const BASE_URL = (process.env.BASE_URL || `http://localhost:${PORT}`).replace(/\/+$/, "");
export const DATA_FILE = process.env.DATA_FILE || path.join(here, "..", "data", "reservations.json");
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";