import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { DATA_FILE } from "../config.js";

let rows = null;

async function load() {
  if (rows) return rows;
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    rows = JSON.parse(raw);
    if (!Array.isArray(rows)) rows = [];
  } catch {
    rows = [];
  }
  return rows;
}

async function save() {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(rows, null, 2));
}

export async function list() {
  return load();
}

export async function find(id) {
  const all = await load();
  return all.find((row) => row.id === id) || null;
}

export async function insert(row) {
  const all = await load();
  all.unshift(row);
  await save();
  return row;
}

export async function remove(id) {
  const all = await load();
  const index = all.findIndex((row) => row.id === id);
  if (index === -1) return false;
  all.splice(index, 1);
  await save();
  return true;
}