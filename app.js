// app.js
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");

const app = express();
async function homePage(req, res) {
  res.json({ message: "Welcome to the Journal APIs" });
}
app.use(express.json());
app.use("/", homePage);
app.use("/auth", authRoutes);
app.use("/api", journalRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
