const express = require("express");
const app = express();

app.get("/ping", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

module.exports = app;