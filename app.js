const express = require("express");
const app = express();

// Package use to upload file
var multer = require("multer");

// Informiing NodeJs to parase the JSON data: So that we can use json data however we want
app.use(express.json());

//Middle ware to solve this error : Access-Control-Allow-Origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

//store the image in the folder with the extension
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${getExten(file.mimetype)}`);
  },
});

// function to get the file extension
const getExten = (mimeType) => {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpeg";
    case "image/png":
      return ".png";
  }
};

// Middleware to make the uploads for to public
app.use("/uploads", express.static("uploads"));

// saving our storage
var upload = multer({ storage: storage });

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

// To store the new course
app.post(
  "/api/cources/new/:cource_name",
  upload.single("concept_image"),
  (req, res) => {
    // replace the slash in the file path of our image location
    let filepath = req.file.path.replace("\\", "/");
    const cource_name = req.params.cource_name;
    const newCource = {
      id: `${Date.now()}`,
      trainer: req.body.trainer,
      concept_name: req.body.concept_name,
      concept_image: filepath,
      concept_video: req.body.concept_video,
    };
    switch (cource_name) {
      case "python":
        newCource.content = {
          code: req.body.content.code,
          description: req.body.content.description,
          source_link: req.body.content.source_link,
        };
        break;
      case "web":
        newCource.content = {
          html_code: req.body.content.html_code,
          css_code: req.body.content.css_code,
          js_code: req.body.content.js_code,
          description: req.body.content.description,
          source_link: req.body.content.source_link,
        };
        break;
    }
    cource_data.addNew(cource_name, newCource);
    res.status(201).send(newCource);
  }
);

app.delete(
  "/api/cources/delete/:cource_name/:cource_id",
  upload.single("concept_image"),
  (req, res) => {
    const cource_name = req.params.cource_name;
    const cource_id = req.params.cource_id;
    const result = cource_data.deleteCource(cource_name, cource_id);
    if (res.status(404)) {
      res.send(result);
    } else {
      res.send(result);
    }
  }
);

app.listen(3000, () => console.log("Listening port 3000"));
