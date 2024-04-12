require("dotenv").config();
const axios = require("axios");
const logResultsToFile = require('./resultsLogger')

const LOCATION = process.env.API_LOCATION || "Italia";
const LANG = process.env.API_LANGUAGE || "it_IT";

const timeStamp = () => {
  return new Date().toISOString().replaceAll(":", "-");
};

const collectAllJobTypes = async (jobList) => {
  for (const job of jobList) {
    await collectJobsByType(job);
  }
};

const collectJobsByType = async (jobType) => {
  const logFileName = `./results/results_${jobType}_${timeStamp()}.json`;

  let collectedData = {
    jobType: jobType,
    jobs: [],
  };

  let data = await sendRequest(jobType);
  collectedData.jobs = collectedData.jobs.concat(data.jobs);

  while (data.jobCount && data.jobCount >= 10) {
    const index = parseInt(data.index, 10);
    data = await sendRequest(jobType, index + 10);
    collectedData.jobs = collectedData.jobs.concat(data.jobs);
  }

  await logResultsToFile(logFileName, collectedData);
};

const sendRequest = async (jobType, index = 0) => {
  const options = {
    method: "GET",
    url: process.env.API_TEST,
    params: {
      query: jobType,
      location: LOCATION,
      language: LANG,
      datePosted: "month",
      employmentTypes: "fulltime;parttime;intern;contractor",
      index: index,
    },
    headers: {
      "X-RapidAPI-Key": process.env.API_KEY,
      "X-RapidAPI-Host": process.env.API_HOST,
    },
  };

  const response = await axios.request(options);
  return response.data;
};

module.exports = { collectJobsByType, collectAllJobTypes };
