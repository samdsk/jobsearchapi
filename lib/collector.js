require("dotenv").config();
const axios = require("axios");
const logResultsToJSONFile = require("./resultsLogger");

const LOCATION = process.env.API_LOCATION || "Italia";
const LANGUAGE = process.env.API_LANGUAGE || "it_IT";

const timeStamp = () => {
  return new Date().toISOString().replaceAll(":", "-");
};

const collectAllJobTypes = async (jobList) => {
  for (const job of jobList) {
    await collectJobsByType(job);
  }
};

const collectJobsByType = async (jobType) => {
  const time = timeStamp();
  const logJobs = `./results/results_${jobType}_${time}`;
  const logFullResponse = `./results/results_${jobType}_${time}_fullresponse`;

  let collectedData = {
    jobType: jobType,
    location: LOCATION,
    language: LANGUAGE,
    jobs: [],
  };

  let data = await sendRequest(jobType);
  collectedData.jobs = collectedData.jobs.concat(data.jobs);
  await logResultsToJSONFile(logFullResponse + "_0", data);
  let count = 1;

  // limiting request to 4 using count variable

  while (data.jobCount && data.jobCount >= 10 && count < 4) {
    const index = parseInt(data.index, 10);
    data = await sendRequest(jobType, index + 10);
    collectedData.jobs = collectedData.jobs.concat(data.jobs);

    await logResultsToJSONFile(logFullResponse + "_" + count, data);

    count++;
  }

  await logResultsToJSONFile(logJobs, collectedData);
  return data;
};

const sendRequest = async (jobType, index = 0) => {
  const options = {
    method: "GET",
    url: process.env.API_URL,
    params: {
      query: jobType,
      location: LOCATION,
      language: LANGUAGE,
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
