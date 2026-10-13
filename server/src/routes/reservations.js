import { Router } from "express";
import { create, list, find, remove } from "../services/reservations.js";
import { toPng } from "../services/qr.js";
import { BASE_URL } from "../config.js";

export const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

router.get("/api/reservations", async (req, res, next) => {
  try {
    res.json({ reservations: await list() });
  } catch (err) {
    next(err);
  }
});

router.get("/api/reservations/:id", async (req, res, next) => {
  try {
    const reservation = await find(req.params.id);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    res.json({ reservation });
  } catch (err) {
    next(err);
  }
});

router.post("/api/reservations", async (req, res, next) => {
  try {
    res.status(201).json(await create(req.body || {}));
  } catch (err) {
    next(err);
  }
});

router.delete("/api/reservations/:id", async (req, res, next) => {
  try {
    const removed = await remove(req.params.id);
    if (!removed) return res.status(404).json({ error: "Reservation not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get("/api/reservations/:id/qr.png", async (req, res, next) => {
  try {
    const reservation = await find(req.params.id);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    const png = await toPng(`${BASE_URL}/r/${reservation.id}`);
    res.setHeader("Content-Type", "image/png");
    res.send(png);
  } catch (err) {
    next(err);
  }
});

router.get("/r/:id", async (req, res, next) => {
  try {
    const reservation = await find(req.params.id);
    if (!reservation) return res.status(404).send("Reservation not found");
    res.redirect(`/view.html?id=${reservation.id}`);
  } catch (err) {
    next(err);
  }
});