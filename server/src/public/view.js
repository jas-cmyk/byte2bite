const card = document.getElementById("card");

/* Inline SVG icons for the reservation rows (see `.icon` in view.css). */
const ICONS = {
  user: '<circle cx="12" cy="7.5" r="3.75"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 3v18"/>',
  users: '<circle cx="9" cy="7.5" r="3.2"/><path d="M2.8 20.5a6.2 6.2 0 0 1 12.4 0"/><path d="M16.5 5.2a3.2 3.2 0 0 1 0 6"/><path d="M18 20.5a6 6 0 0 0-2.2-4.6"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M3 9.5h18"/><path d="M8 3v3"/><path d="M16 3v3"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6.5 9 6 9-6"/>',
  message: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z"/>',
  tag: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"/><circle cx="7" cy="7" r="1.25"/>',
  coins: '<circle cx="9" cy="9" r="6"/><path d="M15.5 6.6a6 6 0 0 1 0 10.8"/><path d="M9 6.5v5"/><path d="M7.5 7.5h2.2a1.3 1.3 0 0 1 0 2.6H7.5h2.2a1.3 1.3 0 0 1 0 2.6H7.5"/>',
};

function icon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "icon");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = ICONS[name] || "";
  return svg;
}

function formatDatetime(value) {
  if (!value) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return `₱${n.toFixed(2)}`;
}

function row(label, value, meta, iconName) {
  const div = document.createElement("div");
  div.className = "row";

  const name = document.createElement("span");
  name.className = "row__label";
  if (iconName) {
    name.appendChild(icon(iconName));
    name.appendChild(document.createTextNode(label));
  } else {
    name.textContent = label;
  }
  div.appendChild(name);

  const wrap = document.createElement("span");
  wrap.className = "row__value";
  wrap.textContent = value || "—";
  if (meta) {
    const metaEl = document.createElement("span");
    metaEl.className = "row__meta";
    metaEl.textContent = meta;
    wrap.appendChild(metaEl);
  }
  div.appendChild(wrap);

  return div;
}

function showError() {
  card.textContent = "";
  const p = document.createElement("p");
  p.className = "card__empty";
  p.textContent = "Reservation not found";
  card.appendChild(p);
}

/* Offer row with the poster thumbnail. Seed paths look like
   "assets/offers/caro1.jpg"; the server exposes them under /assets. */
function offerImage(source) {
  const value = String(source || "").trim();
  if (!value) return "";
  if (/^(https?:)?\/\//.test(value) || value.startsWith("/")) return value;
  return "/" + value.replace(/^\.?\//, "");
}

function offerRow(reservation) {
  const div = document.createElement("div");
  div.className = "row";

  const label = document.createElement("span");
  label.className = "row__label";
  label.appendChild(icon("tag"));
  label.appendChild(document.createTextNode("Offer"));
  div.appendChild(label);

  const value = document.createElement("span");
  value.className = "row__value row__value--offer";

  const image = offerImage(reservation.offerImg);
  if (image) {
    const thumb = document.createElement("img");
    thumb.className = "row__thumb";
    thumb.src = image;
    thumb.alt = reservation.offerName || "Offer";
    thumb.loading = "lazy";
    value.appendChild(thumb);
  }

  const text = document.createElement("span");
  text.className = "row__offer-text";
  text.textContent = reservation.offerName || "None";

  const price = formatMoney(reservation.offerPrice);
  if (price) {
    const meta = document.createElement("span");
    meta.className = "row__meta";
    meta.textContent = price;
    text.appendChild(meta);
  }

  value.appendChild(text);
  div.appendChild(value);
  return div;
}

async function init() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return showError();

  let reservation;
  try {
    const response = await fetch(`/api/reservations/${encodeURIComponent(id)}`);
    if (!response.ok) return showError();
    const data = await response.json();
    reservation = data.reservation;
  } catch {
    return showError();
  }

  card.textContent = "";
  card.appendChild(row("Name", reservation.name, null, "user"));
  card.appendChild(row("Table", reservation.tableName, `${reservation.seats} seats`, "grid"));
  card.appendChild(row("Guests", String(reservation.guests), null, "users"));
  card.appendChild(row("Date & Time", formatDatetime(reservation.datetime), null, "calendar"));
  card.appendChild(offerRow(reservation));
  if (reservation.offerPrice != null) {
    card.appendChild(row("Est. total", formatMoney(reservation.offerPrice), null, "coins"));
  }
  card.appendChild(row("Phone", reservation.phone, null, "phone"));
  card.appendChild(row("Email", reservation.email, null, "mail"));
  card.appendChild(row("Requests", reservation.special, null, "message"));
}

init();
