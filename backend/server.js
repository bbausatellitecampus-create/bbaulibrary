const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
// app.use(cors());
// // allowed cors https://bbaulibrary.onrender.com
app.use(cors({
  origin: ["https://bbaulibrary.onrender.com", "https://bbaulibrary1.onrender.com", "http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const issueRoutes = require("./routes/issueRoutes");

app.use("/api/users", userRoutes); 
app.use("/api/books", bookRoutes);
app.use("/api/issues", issueRoutes);
// add health test route
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
