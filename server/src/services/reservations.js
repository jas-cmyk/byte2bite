import { list, find, insert, remove } from "./store.js";
import { toDataUrl } from "./qr.js";
import { newId } from "../utils/id.js";
import { findOffer } from "../data/offers.js";
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

  // Table ids arrive as "t1".."t4"; tolerate the DOM id form ("table-t1") too.
  const tableId = String(body.tableId || "t1").trim().toLowerCase().replace(/^table-/, "");
  const table = TABLES[tableId] || TABLES.t1;

  // Offer selection is required. The catalogue is the source of truth, so
  // clients cannot invent names or prices.
  const offerId = String(body.offerId || "").trim();
  if (!offerId) {
    const error = new Error("offerId is required");
    error.status = 400;
    throw error;
  }
  const offer = findOffer(offerId);
  if (!offer) {
    const error = new Error(`Unknown offer: ${offerId}`);
    error.status = 400;
    throw error;
  }

  return {
    name,
    phone,
    email: String(body.email || "").trim(),
    datetime,
    guests: Math.min(10, Math.max(1, guests)),
    tableId,
    tableName: table.name,
    seats: table.seats,
    offerId: offer.id,
    offerName: offer.name,
    offerImg: offer.img,
    offerPrice: offer.price,
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