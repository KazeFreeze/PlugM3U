// server.js
// This server now hosts a web UI for configuration and serves the addon dynamically.

const express = require("express");
const fs = require("fs");
const path = require("path");
const addon = require("./addon");

const app = express();
const port = process.env.PORT || 7000;

const M3U_DIR = path.join(__dirname, "m3u");

// Serve the web configuration page
app.use(express.static(path.join(__dirname, "public")));

// API endpoint to list available M3U files
app.get("/api/files", (req, res) => {
  fs.readdir(M3U_DIR, (err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      res.status(500).send("Server error");
      return;
    }
    // Filter for .m3u files
    const m3uFiles = files.filter((file) => file.endsWith(".m3u"));
    res.json(m3uFiles);
  });
});

// Stremio manifest request
app.get("/manifest.json", (req, res) => {
  const files = req.query.files ? req.query.files.split(",") : [];
  if (files.length === 0) {
    return res
      .status(400)
      .send(
        "No M3U files selected. Please configure the addon via the web interface."
      );
  }
  const manifest = addon.getManifest(files);
  res.setHeader("Content-Type", "application/json");
  res.send(manifest);
});

// Stremio catalog request
app.get("/catalog/:type/:id.json", async (req, res) => {
  const { type, id } = req.params;
  const files = req.query.files ? req.query.files.split(",") : [];

  const catalog = await addon.getCatalog(type, id, files);
  res.setHeader("Content-Type", "application/json");
  res.send(catalog);
});

// Stremio stream request
app.get("/stream/:type/:id.json", async (req, res) => {
  const { type, id } = req.params;
  const streams = await addon.getStreams(type, id);
  res.setHeader("Content-Type", "application/json");
  res.send(streams);
});

app.listen(port, () => {
  console.log(
    `Addon server running. Open http://localhost:${port} to configure.`
  );
});
