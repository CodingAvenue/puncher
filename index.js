const express = require("express");
const { punchin, punchout } = require("./lib");
const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("Puncher v0.0.1"));

app.get("/punchin", async (req, res) => {
  try {
    await punchin();
    res.send("done");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.get("/punchout", async (req, res) => {
  try {
    await punchout();
    res.send("done");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.listen(port, () => console.log(`Listening on ${port}`));
