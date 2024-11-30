require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const PORT = process.env.PORT ?? 3000;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

app.post("/api/dump", async (req, res) => {
  const { output } = req.body;
  console.log(output);
  res.json({ success: true });
});

app.get("/", async (req, res) => {
  res.json({ status: "up" });
});

app.listen(PORT, () => {
  console.log(`mstha server running on port http://localhost:${PORT}.`);
});
