const fs = require("fs").promises;
const { insertJob } = require("../db/InsertJob");

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

const addJobRecordsToDBFromFiles = async () => {
  const files = await getResultFiles();
  const summary = [];

  for (const file of files) {
    const jobs = await getJSONFromFile("results/" + file);

    const additionalDetails = {
      searchJobType: jobs.jobType,
      searchLocation: jobs.location,
      searchLanguage: jobs.language,
      searchDate: jobs.searchDate
        ? new Date(jobs.searchDate)
        : new Date(Date.now()),
    };
    let count = 0;
    for (const job of jobs.jobs) {
      const added = await insertJob(job, additionalDetails);
      if (added) count++;
    }

    summary.push({
      collected: jobs.jobs.length,
      inserted: count,
      jobType: jobs.jobType,
      location: jobs.location,
      language: jobs.language,
      searchDate: jobs.searchDate,
    });
  }

  console.log(summary);
};

module.exports = {
  saveToJSON,
  getJobTypesFromFile,
  getJSONFromFile,
  getResultFiles,
  addJobRecordsToDBFromFiles,
};
