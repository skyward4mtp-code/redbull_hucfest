const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { createTracker } = require("./donate-tracker.cjs");
// ===== KẾT NỐI CAKE =====
const CAKE_ENCODED_ID = "318535339";
const CAKE_TIMEOUT_MS = 15_000;
const DEFAULT_PORT = 3098;

const getDonations = createTracker(async (cursor) => {
  const url = new URL("https://gw.cake.vn/public/user-group-account/statement");
  url.searchParams.set("encoded_id", CAKE_ENCODED_ID);
  url.searchParams.set("next_page", cursor);
  const response = await fetch(url, { signal: AbortSignal.timeout(CAKE_TIMEOUT_MS) });
  if (!response.ok) throw new Error("Cake unavailable");
  return response.json();
});
// ===== CÁC ĐƯỜNG DẪN FILE ĐƯỢC PHỤC VỤ =====
const routes = {
  "/assets/images/preview-booth.png": ["assets/images/preview-booth.png", "image/png"],
  "/": ["index.html", "text/html; charset=utf-8"],
  "/donate-tracker.html": ["index.html", "text/html; charset=utf-8"],
  "/assets/css/donate-tracker.css": [
    "assets/css/donate-tracker.css",
    "text/css; charset=utf-8",
  ],
  "/assets/js/donate-tracker.js": [
    "assets/js/donate-tracker.js",
    "application/javascript; charset=utf-8",
  ],
};
// ===== XỬ LÝ API VÀ FILE GIAO DIỆN =====
const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, "http://localhost").pathname;
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405);
      return res.end();
    }
    if (pathname === "/api/donate-progress") {
      try {
        const data = await getDonations();
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        });
        return res.end(req.method === "HEAD" ? undefined : JSON.stringify(data));
      } catch {
        res.writeHead(502, {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        });
        return res.end(
          JSON.stringify({
            error: "Chưa thể cập nhật sao kê Cake. Vui lòng thử lại sau.",
          }),
        );
      }
    }
    const file = routes[pathname];
    if (!file) {
      res.writeHead(404);
      return res.end("Not found");
    }
    const content = await fs.readFile(path.join(__dirname, "public", file[0]));
    res.writeHead(200, { "Content-Type": file[1] });
    res.end(req.method === "HEAD" ? undefined : content);
  } catch {
    res.writeHead(500);
    res.end("Server error");
  }
});
if (require.main === module) {
  const port = process.env.PORT || DEFAULT_PORT;
  server.listen(port, () => console.log(`Donate tracker: http://localhost:${port}`));
}
module.exports = server;
