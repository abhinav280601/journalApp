// app.js
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Journal APIs" });
});
app.use("/auth", authRoutes);
app.use("/api", journalRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
