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
      let pathImage = newTrainer.trainer_image;
      try {
        fs.unlinkSync(`./${pathImage}`);
      } catch (error) {}
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
    const data = this.getAll();
    const findExist = data.find(
      (trainer) => trainer.user_id == newTrainer.user_id
    );
    return findExist;
  }

  editTrainer(user_id, update_Trainer) {
    //   update trainer profile
    const data = this.readData();
    const updateTrainer = JSON.parse(JSON.stringify(update_Trainer));
    // foreach is showing not a functions, so using map() that returns a new array & pushed it to the JSON
    data.map((element) => {
      if (element.user_id == user_id) {
        if (updateTrainer.name) {
          element.name = updateTrainer.name;
        }
        if (updateTrainer.email) {
          element.email = updateTrainer.email;
        }
        if (updateTrainer.trainer_image) {
          let pathImage = element.trainer_image;
          try {
            fs.unlinkSync(`./${pathImage}`);
          } catch (error) {}
          element.trainer_image = updateTrainer.trainer_image;
        }
        if (updateTrainer.mobile) {
          element.mobile = updateTrainer.mobile;
        }
        if (updateTrainer.added_date) {
          element.added_date = updateTrainer.added_date;
        }
        if (updateTrainer.facebook) {
          element.facebook = updateTrainer.facebook;
        }
        if (updateTrainer.twitter) {
          element.twitter = updateTrainer.twitter;
        }
        if (updateTrainer.instagram) {
          element.instagram = updateTrainer.instagram;
        }
        if (updateTrainer.github) {
          element.github = updateTrainer.github;
        }
      } else {
        return false, "Invalid UserId";
      }
    });
    this.storeData(data);
    return true, "Trainer updated successfully";
  }

  deleteTrainer(user_id) {
    // to delete it permenently
    let msg = "";
    let trainerData = this.readData();
    let filterData = "";
    filterData = trainerData.filter((trainer) => trainer.user_id !== user_id);
    if (trainerData.length === filterData.length) {
      msg = "Invalid Id : ID doesn't exist !";
    } else {
      trainerData.map((trainer) => {
        if (trainer.user_id === user_id) {
          let pathImage = trainer.trainer_image;
          try {
            fs.unlinkSync(`./${pathImage}`);
          } catch (error) {}
        }
      });
      trainerData = filterData;
      msg = "Trainer Removed Successfully";
    }
    this.storeData(trainerData);
    return msg;
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
