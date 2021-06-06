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

  addNew(cource_name, newCource) {
    // to add new course
    const data = this.readData();
    for (var i in data) {
      if (data[i].name == cource_name) {
        data[i].data.push(newCource);
      }
    }
    this.storeData(data);
  }

  editCource() {
    // to edit new course
  }

  deleteCource(cource_name, cource_id) {
    // to delete it permenently
    const data = this.readData();
    const cource_data = data.find((cource) => cource.name == cource_name);
    const finalData = cource_data.data;
    console.log(finalData);
    finalData.forEach((element, index) => {
      if (cource_id == element.id) {
        finalData.splice(index, 1);
        this.storeData(finalData);
        // return "success";
      }
    });
    console.log(finalData);
  }

  readData() {
    //   to read the data from the json file
    let rawData = fs.readFileSync(PATH);
    let cources = JSON.parse(rawData);
    return cources;
  }

  storeData(rawData) {
    let data = JSON.stringify(rawData);
    fs.writeFileSync(PATH, data);
  }
}

module.exports = Cources;
