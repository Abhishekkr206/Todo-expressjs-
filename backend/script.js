const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoute = require("./routes/auth.js");
const taskRoute = require("./routes/task.js");

require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("PORT:", process.env.PORT);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL

// trust proxy (needed for secure cookies on Render)
app.set("trust proxy", 1);


// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({
  origin: "https://todo-boi.vercel.app",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoute);
app.use("/tasks", taskRoute);

// MongoDB connection
mongoose.connect(MONGO_URL, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=>app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`)))
  .catch(err=>console.log(err));
