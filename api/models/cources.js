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
    let msg = "";
    const courceData = this.readData();
    let filterData = "";
    courceData.forEach((main_element, i) => {
      if (main_element.name == cource_name) {
        courceData[i].data.forEach((element, j) => {
          if (element.id === cource_id) {
            let pathImage = element.concept_image;
            try {
              fs.unlinkSync(`./${pathImage}`);
            } catch (error) {}
          }
        });
        filterData = courceData[i].data.filter(
          (cource) => cource.id !== cource_id
        );
        if (courceData[i].data.length === filterData.length) {
          msg = "Invalid Id : ID doesn't exist !";
        } else {
          courceData[i].data = filterData;
          msg = "Concept Removed Successfully";
        }
      } else {
        msg = "Invalid cource : Cource doesn't exist !";
      }
    });
    // console.log(filterData);
    this.storeData(courceData);
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

module.exports = Cources;
