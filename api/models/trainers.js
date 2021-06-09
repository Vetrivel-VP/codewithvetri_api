const PATH = "./trainers.json";
const fs = require("fs");

class Trainers {
  getAll() {
    //   to get all
    return this.readData();
  }

  getIndividualTrainer(user_id) {
    //   to get single trainer
    const data = this.readData();
    return data.find((trainer) => trainer.user_id == user_id);
  }

  addNewTrainer(newTrainer) {
    //   to add new trainer
    const data = this.readData();
    let msg = "";
    const trainerExist = this.verifyTrainerId(newTrainer);
    if (trainerExist) {
      msg = "User-Id Already exists🙄";
      return msg;
    } else {
      data.unshift(newTrainer);
      this.storeData(data);
      msg = "Trainer added successfully😊";
      return msg;
    }
  }

  verifyTrainerId(newTrainer) {
    const data = this.readData();
    const findExist = data.find(
      (trainer) => trainer.user_id == newTrainer.user_id
    );
    return findExist;
  }

  editTrainer() {
    //   update trainer profile
  }

  readData() {
    //   to read the data from the json file
    let rawData = fs.readFileSync(PATH);
    return JSON.parse(rawData);
  }

  storeData(rawData) {
    let data = JSON.stringify(rawData);
    fs.writeFileSync(PATH, data);
  }
}

module.exports = Trainers;
