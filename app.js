require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectToDatabase = require("./db");
const authRoutes = require("./routes/authRoutes");
const dogRoutes = require("./routes/dogRoutes");

const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dogs", dogRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await connectToDatabase();

  const port = process.env.PORT || 3000;

  app.listen(port, function () {
    console.log(`Server running on port ${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
