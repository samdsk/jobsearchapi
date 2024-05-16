require("dotenv").config();
const fs = require("fs").promises;
const { insertJob } = require("./InsertJob");
const JobSchema = require("../schema/JobSchema");
const CRUDJobPost = require("./CRUDJobPost");
const mongoose = require("mongoose");
const { RapidApiJobPost } = require("./ConvertToJobPost");
const { generateID } = require("./generateID");

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

const addJobDescriptionsFromFiles = async () => {
  const files = await getResultFiles();
  const summary = [];

  for (const file of files) {
    const res = await addJobDescriptionsFromFile("results/" + file);
    summary.push(res);
  }

  console.log(summary);
};

const addJobDescriptionsFromFile = async (filename) => {
  const jobs = await getJSONFromFile(filename);

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

  return {
    collected: jobs.jobs.length,
    inserted: count,
    jobType: jobs.jobType,
    location: jobs.location || process.env.API_LOCATION,
    language: jobs.language || process.env.API_LANGUAGE,
    searchDate: jobs.searchDate,
  };
};

async function transferDataBase(url) {
  await mongoose.connect(url);
  const total = await JobSchema.countDocuments();
  let count = 0;

  for await (const job of JobSchema.find()) {
    const jobPost = RapidApiJobPost(job, job.searchJobType);
    try {
      await CRUDJobPost.createJobPost(jobPost);
      count++;
    } catch (err) {
      console.error(
        "JobSchema id: " +
          job._id +
          " ### JobPost _id: " +
          jobPost._id +
          " : " +
          err.message
      );
    }
  }
  await mongoose.connection.close();
  return { total: total, count: count };
}

module.exports = {
  saveToJSON,
  getJobTypesFromFile,
  getJSONFromFile,
  getResultFiles,
  addJobDescriptionsFromFiles,
  addJobDescriptionsFromFile,
  transferDataBase,
};
