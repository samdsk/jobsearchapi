const crypto = require("crypto");

/**
 * Generates a string without spaces using title, company and location fields
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

  let output = "";
  output += job_post.title.replace(/  +/g, "").trim();
  output += job_post.company.replace(/  +/g, "").trim();
  output += job_post.location.replace(/  +/g, "").trim();

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
