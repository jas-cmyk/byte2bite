#!/usr/bin/env bash
set -euo pipefail
API="${API:-http://localhost:3000}"

usage() {
  echo "usage: $0 {create|list|offers|get|qr|delete} [id]"
}

create() {
  curl -sS -X POST "$API/api/reservations" \
    -H "Content-Type: application/json" \
    -d @examples/sample-payload.json
}

list() {
  curl -sS "$API/api/reservations"
}

offers() {
  curl -sS "$API/api/offers"
}

get() {
  curl -sS "$API/api/reservations/$1"
}

qr() {
  curl -sS -o qr.png "$API/api/reservations/$1/qr.png"
  echo "saved qr.png"
}

delete() {
  curl -sS -X DELETE -w "\n%{http_code}\n" "$API/api/reservations/$1"
}

case "${1:-}" in
  create) create ;;
  list) list ;;
  offers) offers ;;
  get) get "${2:?id required}" ;;
  qr) qr "${2:?id required}" ;;
  delete) delete "${2:?id required}" ;;
  *) usage ;;
esac