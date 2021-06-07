const PATH = "./trainers.json";
const fs = require("fs");

class Trainers {
  getAll() {
    //   to get all
    return this.readData();
  }

  getIndividualTrainer() {
    //   to get single trainer
  }

  addNewTrainer(newTrainer) {
    //   to add new trainer
    const data = this.readData();
    data.unshift(newTrainer);
    this.storeData(data);
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
