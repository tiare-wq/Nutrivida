import { openDatabase } from "./db.js";
import { createApp } from "./app.js";
const db = openDatabase();
const port = Number(process.env.PORT || 4387);
const server = createApp(db);
server.listen(port, process.env.HOST || "127.0.0.1", () =>
  console.log(`NutriVida: http://${process.env.HOST || "127.0.0.1"}:${port}`),
);
server.on("error", (error) => {
  console.error(
    error.code === "EADDRINUSE"
      ? `El puerto ${port} está ocupado. Usa otro valor en PORT.`
      : error.message,
  );
  db.close();
  process.exit(1);
});
function stop() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
