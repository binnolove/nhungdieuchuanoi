const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, "public");
const DB = path.join(ROOT, ".local-letters.json");
let locked = false;

if (!fs.existsSync(DB)) fs.writeFileSync(DB, "[]", "utf8");

function readDB() {
  try { return JSON.parse(fs.readFileSync(DB, "utf8")); }
  catch { return []; }
}
function writeDB(rows) {
  fs.writeFileSync(DB, JSON.stringify(rows, null, 2), "utf8");
}
function clean(value, max = 4000) {
  return typeof value === "string"
    ? value.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim().slice(0, max)
    : "";
}
function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(body);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 100_000) req.destroy();
    });
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { reject(Object.assign(new Error("JSON không hợp lệ."), { status: 400 })); }
    });
    req.on("error", reject);
  });
}
function contentType(file) {
  return ({
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".mp3": "audio/mpeg",
    ".ttf": "font/ttf",
    ".json": "application/json; charset=utf-8",
    ".txt": "text/plain; charset=utf-8"
  })[path.extname(file).toLowerCase()] || "application/octet-stream";
}
function safePublicPath(urlPath) {
  const requested = urlPath === "/" ? "index.html" : decodeURIComponent(urlPath.replace(/^\/+/, ""));
  const full = path.resolve(PUBLIC, requested);
  const base = path.resolve(PUBLIC) + path.sep;
  return full === path.resolve(PUBLIC, "index.html") || full.startsWith(base) ? full : null;
}
async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/api/health") {
    return json(res, 200, { ok: true, service: "nhung-dieu-chua-noi", version: "local" });
  }

  if (req.method === "POST" && url.pathname === "/api/letters") {
    const body = await readBody(req);
    const text = clean(body.text);
    if (!text) return json(res, 400, { ok: false, error: "Lá thư đang trống." });
    const item = {
      id: crypto.randomUUID(),
      text,
      status: "waiting",
      createdAt: new Date().toISOString()
    };
    const rows = readDB();
    rows.push(item);
    writeDB(rows);
    return json(res, 201, { ok: true, id: item.id });
  }

  if (req.method === "POST" && url.pathname === "/api/letters-next") {
    if (locked) return json(res, 409, { ok: false, error: "Hãy thử nhận thư lại sau một chút." });
    locked = true;
    try {
      const rows = readDB();
      const item = rows.find(x => x.status === "waiting");
      if (!item) return json(res, 200, { ok: true, found: false });
      item.status = "claimed";
      item.claimedAt = new Date().toISOString();
      writeDB(rows);
      return json(res, 200, { ok: true, found: true, letter: { id: item.id, text: item.text, createdAt: item.createdAt } });
    } finally {
      locked = false;
    }
  }

  if (req.method === "POST" && url.pathname === "/api/reply") {
    const parentId = String(url.searchParams.get("id") || "").trim();
    if (!parentId) return json(res, 400, { ok: false, error: "Thiếu mã lá thư." });

    const body = await readBody(req);
    const text = clean(body.text ?? body.reply, 4000);
    if (!text) return json(res, 400, { ok: false, error: "Hồi đáp đang trống." });

    const rows = readDB();
    const item = rows.find(x => x.id === parentId && x.status === "claimed");
    if (!item) return json(res, 409, { ok: false, error: "Lá thư này không còn chờ hồi đáp." });

    item.status = "answered";
    item.reply = text;
    item.answeredAt = new Date().toISOString();
    const next = {
      id: crypto.randomUUID(),
      text,
      replyTo: item.id,
      status: "waiting",
      createdAt: new Date().toISOString()
    };
    rows.push(next);
    writeDB(rows);
    return json(res, 201, { ok: true, id: next.id });
  }

  if (req.method !== "GET") return json(res, 404, { ok: false, error: "Not found" });

  const file = safePublicPath(url.pathname);
  if (!file) return res.writeHead(403).end();

  fs.readFile(file, (err, data) => {
    if (err) return res.writeHead(404).end("Not found");
    res.writeHead(200, { "Content-Type": contentType(file), "Cache-Control": "no-cache" });
    res.end(data);
  });
}

http.createServer((req, res) => {
  route(req, res).catch(err => {
    console.error(err);
    json(res, err.status || 500, { ok: false, error: err.status ? err.message : "Có lỗi máy chủ." });
  });
}).listen(PORT, () => console.log(`Những Điều Chưa Nói: http://localhost:${PORT}`));
