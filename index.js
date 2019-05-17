require("dotenv").config();
const express = require("express");
const { punchin, punchout, ispunchedin } = require("./lib");
const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("Puncher v0.0.20"));

app.get("/punchin", async (req, res) => {
  try {
    await punchin();
    res.json({
      success: true
    });
  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
});

app.get("/ispunchedin", async (req, res) => {
  try {
    const result = await ispunchedin();
    res.json({
      success: result
    });
  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
});

app.get("/punchout", async (req, res) => {
  try {
    await punchout();
    res.json({
      success: true
    });
  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
});

// TODO: Migrate to TypeScript

app.listen(port, () => console.log(`Listening on ${port}`));
