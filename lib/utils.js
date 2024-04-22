const fs = require("fs").promises;

const getJobTypesFromFile = async (filename) => {
  const res = await getJSONFromFile(filename);
  const jobTypes = JSON.parse(res).map((job) => job.toLowerCase().trim());
  return jobTypes;
};

const getJSONFromFile = async (filename) => {
  const jobListString = await fs.readFile(filename, {
    flag: "r",
  });

  return JSON.parse(jobListString);
};

const saveToJSON = async (filename, list) => {
  await fs.writeFile(filename + ".json", JSON.stringify(list), {
    encoding: "utf8",
  });
};

module.exports = {
  saveToJSON,
  getJobTypesFromFile,
  getJSONFromFile,
};
