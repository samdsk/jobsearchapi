const { generateID } = require("./generateID");
const CRUDJobPost = require("./CRUDJobPost");
const ConvertToJobPost = require("./ConvertToJobPost");

const insertAllJobs = async (data) => {
  const additionalDetails = {
    searchJobType: data.jobType,
    searchLocation: data.location,
    searchLanguage: data.language,
    searchDate: data.searchDate,
  };
  let count = 0;

  for (const job of data.jobs) {
    const res = await insertJob(job, additionalDetails);
    if (res) count++;
  }

  return count;
};

const insertJob = async (job, additionalDetails) => {
  const jobPost = ConvertToJobPost.RapidApiJobPost(
    job,
    additionalDetails.searchJobType
  );
  try {
    return await CRUDJobPost.createJobPost(jobPost);
  } catch (err) {
    if (err.message && err.message.startsWith("E11000")) return null;
    else throw err;
  }
};

const setJobSchemaID = (job) => {
  const newJob = { ...job };
  newJob._id = generateID(job);
  return newJob;
};

module.exports = {
  insertJob,
  insertAllJobs,
  setJobSchemaID,
};
