/**
 * Converts RapidApi_JobPost -> JobPost
 * @param {RapidApi_JobPost} data requires a RapidApi_JobPost object
 * @param {String} job_type requires JobPost type
 * @returns JobPost
 * @throws an Error if job_type is not valid
 */
const RapidApiJobPost = (data, job_type) => {
  if (!job_type || typeof job_type !== "string")
    throw new Error("Invalid job_type");

  const links = [];

  for (const jobProvider of data.jobProviders) {
    links.push({ source: jobProvider.jobProvider, url: jobProvider.url });
  }

  return {
    job_type: job_type,
    title: data.title,
    company: data.company,
    location: data.location,
    description: data.description,
    employment_type: data.employmentType,
    links: links,
  };
};

module.exports = { RapidApiJobPost };
