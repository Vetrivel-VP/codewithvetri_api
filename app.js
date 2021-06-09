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
    res.status(200).send({ success: true, cource: foundCource });
  } else {
    res.status(404).send({ error: true, msg: "ID Not found" });
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
      added_date: `${Date.now()}`,
      description: req.body.description,
      source_link: req.body.source_link,
    };

    cource_data.addNew(cource_name, newCource);
    if (
      newCource.trainer == null ||
      newCource.concept_name == null ||
      newCource.concept_video == null ||
      newCource.description == null ||
      newCource.source_link == null
    ) {
      res
        .status(409)
        .send({ error: true, msg: "Required parameters must be filled" });
    } else {
      res.status(201).send({ success: true, msg: "Data added successfully" });
    }
  }
);

app.delete("/api/cources/delete/:cource_name/:cource_id", (req, res) => {
  const cource_name = req.params.cource_name;
  const cource_id = req.params.cource_id;
  const result = cource_data.deleteCource(cource_name, cource_id);
  if (res.status(404)) {
    res.send({ error: true, msg: result });
  } else {
    res.status(200).send({ success: true, msg: result });
  }
});

// Update cources
app.put(
  "/api/cources/update/:cource_name/:cource_id",
  upload.single("concept_image"),
  (req, res) => {
    const cource_name = req.params.cource_name;
    const cource_id = req.params.cource_id;
    const bodyData = req.body;
    if (req.file) {
      let filepath = req.file.path.replace("\\", "/");
      bodyData.concept_image = filepath;
    }
    if (
      bodyData.trainer == null ||
      bodyData.concept_name == null ||
      bodyData.concept_image == null ||
      bodyData.concept_video == null ||
      bodyData.description == null ||
      bodyData.source_link == null
    ) {
      res
        .status(409)
        .send({ error: true, msg: "Warning* : Required fields missing" });
    } else {
      let flag,
        msg = cource_data.editCource(cource_name, cource_id, bodyData);
      if (flag == true) {
        res.status(200).send({ success: true, msg: msg });
      } else {
        res.send({ error: true, msg: msg });
      }
    }
  }
);

// Trainers API

const Trainers = require("./api/models/trainers");
const trainers = new Trainers();
app.get("/api/trainers", (req, res) => {
  if (res.status(200)) {
    res.send(trainers.getAll());
  } else {
    res.status(404).send({ error: true, msg: "Json file not loaded" });
  }
});

// get single trainer
app.get("/api/trainers/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  const foundTrainer = trainers.getIndividualTrainer(user_id);
  if (foundTrainer) {
    res.status(200).send({ success: true, cource: foundTrainer });
  } else {
    res.status(404).send({ error: true, msg: "User Not found" });
  }
});

app.post("/api/trainers/new", upload.single("trainer_image"), (req, res) => {
  let filepath = req.file.path.replace("\\", "/");
  const newTrainer = {
    id: `${Date.now()}`,
    user_id: req.body.user_id,
    name: req.body.name,
    email: req.body.email,
    trainer_image: filepath,
    mobile: req.body.mobile,
    added_date: `${Date.now()}`,
    facebook: req.body.facebook,
    twitter: req.body.twitter,
    instagram: req.body.instagram,
    github: req.body.github,
    account_status: "",
  };

  if (
    newTrainer.name == null ||
    newTrainer.email == null ||
    newTrainer.trainer_image == null ||
    newTrainer.mobile == null
  ) {
    res.status(401).send({ error: true, msg: "User data missing" });
  } else {
    const msg = trainers.addNewTrainer(newTrainer);
    res.send({ success: true, msg: msg });
  }
});
app.listen(process.env.PORT || 3000, () => console.log("Listening port 3000"));
