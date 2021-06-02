const PATH = "./cource_data.json";
const fs = require("fs");

class Cources {
  getAll() {
    // to get all the cources
    return this.readData();
  }

  getIndividualCource(cource_name, cource_id) {
    // to get selective cource using id
    const data = this.readData();
    const cource_data = data.find((cource) => cource.name == cource_name);
    const finalData = cource_data.data.find((cource) => cource.id == cource_id);
    // console.log(finalData);
    return finalData;
  }

  addNew() {
    // to add new course
  }

  editCource() {
    // to edit new course
  }

  deleteCource() {
    // to delete it permenently
  }

  readData() {
    //   to read the data from the json file
    let rawData = fs.readFileSync(PATH);
    let cources = JSON.parse(rawData);
    return cources;
  }
}

module.exports = Cources;
