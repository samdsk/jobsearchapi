const fs = require("fs").promises;

const getJobTypesFromFile = async (filename) => {
  const res = await getJSONFromFile(filename);
  const jobTypes = res.map((job) => job.toLowerCase().trim());
  return jobTypes;
};

const getJSONFromFile = async (filename) => {
  const jobListString = await fs.readFile(filename, {
    flag: "r",
  });

  return JSON.parse(jobListString);
};

const saveToJSON = async (filename, data) => {
  await fs.writeFile(filename + ".json", JSON.stringify(data), {
    encoding: "utf8",
  });
};

const getResultFiles = async () => {
  const files = await fs.readdir("results/");

  return files.filter((file) => file.startsWith("results"));
};

module.exports = {
  saveToJSON,
  getJobTypesFromFile,
  getJSONFromFile,
  getResultFiles,
};
