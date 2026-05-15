import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");

const filePath = (name) => path.join(DATA_DIR, `${name}.json`);

async function ensureFile(name, fallback = []) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = filePath(name);
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, JSON.stringify(fallback, null, 2));
  }
  return file;
}

export async function readJSON(name, fallback = []) {
  const file = await ensureFile(name, fallback);
  const raw = await fs.readFile(file, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function writeJSON(name, data) {
  const file = await ensureFile(name, data);
  await fs.writeFile(file, JSON.stringify(data, null, 2));
  return data;
}

export async function appendItem(name, item) {
  const list = await readJSON(name, []);
  list.push(item);
  await writeJSON(name, list);
  return item;
}

export async function updateItem(name, predicate, patch) {
  const list = await readJSON(name, []);
  const idx = list.findIndex(predicate);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  await writeJSON(name, list);
  return list[idx];
}

export async function removeItem(name, predicate) {
  const list = await readJSON(name, []);
  const next = list.filter((x) => !predicate(x));
  await writeJSON(name, next);
  return list.length - next.length;
}
