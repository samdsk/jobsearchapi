const fs = require("fs");

const RES_DIR = "./results/";

const getPathCompatibleStringFromDate = (date) => {
  return date.toISOString().replaceAll(":", "-");
};

const logResultsToJSONFile = async (filename, date, results) => {
  const timeStamp = getPathCompatibleStringFromDate(date);

  await fs.promises.writeFile(
    `${RES_DIR}${filename}_${timeStamp}.json`,
    JSON.stringify(results),
    {
      flag: "w",
    }
  );
};

module.exports = {
  logResultsToJSONFile,
  RES_DIR,
  getPathCompatibleStringFromDate,
};
