const card = document.getElementById("card");

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

function row(label, value, meta) {
  const div = document.createElement("div");
  div.className = "row";

  const name = document.createElement("span");
  name.className = "row__label";
  name.textContent = label;
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
  card.appendChild(row("Name", reservation.name));
  card.appendChild(row("Table", reservation.tableName, `${reservation.seats} seats`));
  card.appendChild(row("Guests", String(reservation.guests)));
  card.appendChild(row("Date & Time", formatDatetime(reservation.datetime)));
  card.appendChild(row("Phone", reservation.phone));
  card.appendChild(row("Email", reservation.email));
  card.appendChild(row("Requests", reservation.special));
}

init();