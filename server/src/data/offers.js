/* Offer catalogue — derived from the shared seed data (../../../lib/seed.js),
   which is the single source of truth for the site (`offers_seed`). The seed is
   a plain script that also exports via module.exports, so Node can import it
   without a bundler and the server can never drift from what the site renders.

   Each offer carries: id, name, img and price. */

import seed from "../../../lib/seed.js";

export const OFFERS = {};

for (const offer of seed.offers_seed || []) {
  const id = String(offer.id || "").trim().toLowerCase();
  if (!id) continue;
  OFFERS[id] = {
    id: offer.id,
    name: offer.name || "",
    img: offer.img || "",
    price: Number(offer.price),
  };
}

export function listOffers() {
  return Object.values(OFFERS);
}

export function findOffer(id) {
  return OFFERS[String(id || "").trim().toLowerCase()] || null;
}
