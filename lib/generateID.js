const crypto = require("crypto");
const DataCleaning = require("./dataCleaning");

/**
 * Generates a string without spaces and special characters using title, company and location fields of a jobpost
 * @param {JobPost} job_post required a valid JobPost
 * @returns string
 * @throws an error if JobPost is invalid
 */
function jobToStringTitleCompanyLocation(job_post) {
  if (!job_post.title || !job_post.company || !job_post.location)
    throw new Error("Invalid JobPost!");

  if (
    typeof job_post.title !== "string" ||
    typeof job_post.company !== "string" ||
    typeof job_post.location !== "string"
  )
    throw new Error("Invalid JobPost!");

  const replace = "";

  let output = "";
  output += DataCleaning.cleanString(job_post.title, replace);
  output += DataCleaning.cleanString(job_post.company, replace);
  output += DataCleaning.cleanString(job_post.location, replace);
  return output.toLowerCase();
}

/**
 * Generates an unique string based on title, company and location fields of a JobPost object
 * @param {JobPost} job_post requires a valid JobPost
 * @returns string
 */
function generateID(job_post) {
  const strToHash = jobToStringTitleCompanyLocation(job_post);
  const res = crypto.createHash("sha512").update(strToHash).digest("base64");
  return res;
}

module.exports = {
  jobToStringTitleCompanyLocation,
  generateID,
};
