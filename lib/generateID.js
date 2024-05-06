const crypto = require("crypto");

function jobToStringTitleCompanyLocation(job) {
  let output = "";
  output += job.title.replace(/  +/g, "").trim();
  output += job.company.replace(/  +/g, "").trim();
  output += job.location.replace(/  +/g, "").trim();

  return output.toLowerCase();
}

function generateHash(job) {
  const strToHash = jobToStringTitleCompanyLocation(job);
  const res = crypto.createHash("sha512").update(strToHash).digest("base64");
  return res;
}

module.exports = {
  jobToStringTitleCompanyLocation,
  generateHash,
};
