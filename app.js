const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/database");
const invoiceRoutes = require("./routes/invoiceRoutes");

dotenv.config();

const app = express();

// ─── 1. CORS DULU (paling atas) ──────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:5500",
    "https://vendor-invoice-client.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ─── 2. BODY PARSER ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── 3. PING — tidak butuh DB, taruh sebelum DB middleware ───────────────────
app.get("/ping", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ─── 4. DB MIDDLEWARE — hanya untuk route yang butuh DB ──────────────────────
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ─── 5. ROUTES ───────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Vendor Invoice API Running 🚀" });
});

app.use("/api/invoices", invoiceRoutes);

// ─── 6. 404 ──────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─── 7. GLOBAL ERROR HANDLER ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});

module.exports = app;