const express = require("express");
const app = express();

// loading course data
const Cources = require("./api/models/cources");
const cource_data = new Cources();

// Get ALl Cources
app.get("/api/cources", (req, res) => {
  res.status(200).send(cource_data.getAll());
});

// Get Individual cource
app.get("/api/cources/:cource_name/:cource_id", (req, res) => {
  const cource_id = req.params.cource_id;
  const cource_name = req.params.cource_name;
  const foundCource = cource_data.getIndividualCource(cource_name, cource_id);
  if (foundCource) {
    res.status(200).send(foundCource);
  } else {
    res.status(404).send("Not Found : Invalid Id");
  }
});

app.listen(3000, () => console.log("Listening port 3000"));
