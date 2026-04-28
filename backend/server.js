const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Performance: Compression
app.use(compression());

// 3. Rate Limiting: Global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/", globalLimiter);

// 4. Rate Limiting: Strict for Auth
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login/register requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many authentication attempts, please try again after an hour"
});
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

// 5. CORS Configuration
app.use(cors({
  origin: ["https://bbaulibrary.onrender.com", "https://bbaulibrary-euz3.onrender.com", "http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

// 6. Body Parsers with Reasonable Limits
app.use(express.json({ limit: '10mb' })); // Reduced from 50mb for security
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const issueRoutes = require("./routes/issueRoutes");

app.use("/api/users", userRoutes); 
app.use("/api/books", bookRoutes);
app.use("/api/issues", issueRoutes);

// Health test route
app.get("/api/health", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 8888;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EACCES') {
        console.error(`❌ Port ${PORT} requires elevated privileges or is restricted.`);
      } else if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
      } else {
        console.error(`❌ Server Error: ${err.message}`);
      }
    });
  })
  .catch(err => console.error("❌ DB Error:", err.message));
