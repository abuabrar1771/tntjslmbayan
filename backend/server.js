import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./dbConnection/db.js";
import speakerRoutes from "./routes/speakerRoutes.js";
import speechRoutes from "./routes/speechRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

// 🔒 Robust CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    // If no origin (e.g., Postman, mobile apps, or same-origin), allow it
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      // Echo back the EXACT origin (never wildcard '*')
      return callback(null, origin);
    } else {
      return callback(new Error("CORS policy violation: Origin not allowed"), false);
    }
  },
  credentials: true, // Crucial for withCredentials: true
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

// 1. Apply CORS middleware globally
app.use(cors(corsOptions));

// 2. Handle preflight (OPTIONS) requests safely across all routes
app.options(/(.*)/, cors(corsOptions));

// 3. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Request Logging Middleware
app.use((req, res, next) => {
  console.log(`📡 [${req.method}] ${req.originalUrl}`);
  next();
});

// 5. Root Route
app.get("/", (req, res) => {
  res.send("TNTJ Bayan Backend Server is Running Operational!");
});

// 6. Application Routes
app.use("/api/speakers", speakerRoutes);
if (speechRoutes) {
  app.use("/api/speech", speechRoutes);
}

// 7. Prevent unhandled rejections from stopping Node
process.on("unhandledRejection", (err) => {
  console.error("⚠️ Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("⚠️ Uncaught Exception:", err);
});

// 8. Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server operating smoothly on http://localhost:${PORT}`);
});

// Keep process active explicitly against early exit
setInterval(() => {}, 1000000);

export default app;