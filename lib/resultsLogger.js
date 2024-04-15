const fs = require("fs");

const logResultsToJSONFile = async (filename, results) => {
  await fs.promises.writeFile(filename + ".json", JSON.stringify(results), {
    flag: "w",
  });
};

module.exports = logResultsToJSONFile;
