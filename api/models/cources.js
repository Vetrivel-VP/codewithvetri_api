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

  editCource(cource_name, cource_id, updateData) {
    // to edit the course
    let msg = "";
    const update_Data = JSON.parse(JSON.stringify(updateData));
    const mainData = this.readData();
    mainData.forEach((main_element, i) => {
      if (main_element.name == cource_name) {
        main_element.data.forEach((element, j) => {
          if (element.id === cource_id) {
            msg = " Data Saved Successfully";
            if (update_Data.trainer) {
              element.trainer = update_Data.trainer;
              element.added_date = `${Date.now()}`;
            }
            if (update_Data.concept_name) {
              element.concept_name = update_Data.concept_name;
            }
            if (update_Data.concept_video) {
              element.concept_video = update_Data.concept_video;
            }
            if (update_Data.concept_image) {
              let pathImage = element.concept_image;
              try {
                fs.unlinkSync(`./${pathImage}`);
              } catch (error) {}
              element.concept_image = update_Data.concept_image;
            }
            if (update_Data.description) {
              element.description = update_Data.description;
            }
            if (update_Data.source_link) {
              element.source_link = update_Data.source_link;
            }
            this.storeData(mainData);
          } else {
            msg = "Error : Invalid Cource ID";
          }
        });
      } else {
        msg = "Error : Invalid Cource Name";
      }
    });

    return true, msg;
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
