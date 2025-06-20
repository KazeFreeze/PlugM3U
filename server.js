// server.js
// This server now hosts a web UI for configuration and serves the addon dynamically.
const express = require("express");
const fs = require("fs");
const path = require("path");
const addon = require("./addon");

const app = express();
const port = process.env.PORT || 7000;

const M3U_DIR = path.join(__dirname, "m3u");

// Define a cache header value to be reused across routes.
// s-maxage=3600: Cache on Vercel's Edge Network for 1 hour.
// stale-while-revalidate=86400: Serve stale content for 24 hours while revalidating.
// This greatly improves performance and reduces serverless function invocations.
const CACHE_HEADER = "public, s-maxage=3600, stale-while-revalidate=86400";

// Serve the web configuration page from the 'public' directory.
app.use(express.static(path.join(__dirname, "public")));

// API endpoint to list available M3U files for the configuration page.
app.get("/api/files", (req, res) => {
  fs.readdir(M3U_DIR, (err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      res.status(500).send("Server error");
      return;
    }
    // Filter for .m3u files only.
    const m3uFiles = files.filter((file) => file.endsWith(".m3u"));
    res.json(m3uFiles);
  });
});

// Stremio manifest request. This is the entry point for the addon installation.
app.get("/manifest.json", (req, res) => {
  // The selected files are passed as a comma-separated query parameter.
  const files = req.query.files ? req.query.files.split(",") : [];
  if (files.length === 0) {
    return res
      .status(400)
      .send(
        "No M3U files selected. Please configure the addon via the web interface."
      );
  }
  const manifest = addon.getManifest(files);

  // **OPTIMIZATION**
  // Set the caching headers for the manifest response.
  res.setHeader("Cache-Control", CACHE_HEADER);
  res.setHeader("Content-Type", "application/json");
  res.send(manifest);
});

// Stremio catalog request. This is called when a user opens the addon's catalog in Stremio.
app.get("/catalog/:type/:id.json", async (req, res) => {
  const { type, id } = req.params;
  // The configuration (selected files) must be passed along in the request from Stremio.
  const files = req.query.files ? req.query.files.split(",") : [];

  const catalog = await addon.getCatalog(type, id, files);

  // **OPTIMIZATION**
  // Set the caching headers for the catalog response.
  res.setHeader("Cache-Control", CACHE_HEADER);
  res.setHeader("Content-Type", "application/json");
  res.send(catalog);
});

// Stremio stream request. This is called when a user clicks on a channel to play it.
app.get("/stream/:type/:id.json", async (req, res) => {
  const { type, id } = req.params;
  const streams = await addon.getStreams(type, id);

  // Stream responses are typically not cached as they are single-use and dynamic.
  res.setHeader("Content-Type", "application/json");
  res.send(streams);
});

app.listen(port, () => {
  console.log(
    `Addon server running. Open http://localhost:${port} to configure.`
  );
});
