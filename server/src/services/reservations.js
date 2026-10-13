import { list, find, insert, remove } from "./store.js";
import { toDataUrl } from "./qr.js";
import { newId } from "../utils/id.js";
import { BASE_URL } from "../config.js";

const TABLES = {
  t1: { name: "Table 1", seats: 2 },
  t2: { name: "Table 2", seats: 4 },
  t3: { name: "Table 3", seats: 4 },
  t4: { name: "Table 4", seats: 6 },
};

export function normalize(body) {
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const datetime = String(body.datetime || "").trim();
  const guests = Math.round(Number(body.guests));

  if (!name || !phone || !datetime || !Number.isFinite(guests)) {
    const error = new Error("name, phone, datetime and guests are required");
    error.status = 400;
    throw error;
  }

  const tableId = String(body.tableId || "t1").toLowerCase();
  const table = TABLES[tableId] || TABLES.t1;

  return {
    name,
    phone,
    email: String(body.email || "").trim(),
    datetime,
    guests: Math.min(10, Math.max(1, guests)),
    tableId,
    tableName: table.name,
    seats: table.seats,
    special: String(body.special || "").trim(),
  };
}

export async function create(body) {
  const data = normalize(body);
  const reservation = { id: newId(), createdAt: new Date().toISOString(), ...data };
  await insert(reservation);
  const viewUrl = `${BASE_URL}/r/${reservation.id}`;
  const qr = await toDataUrl(viewUrl);
  return { reservation, viewUrl, qr };
}

export { list, find, remove };