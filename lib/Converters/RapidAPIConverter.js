const Converter = require("./Converter");

class RapidAPIConverter extends Converter {
  static convert(job, job_type) {
    if (!job_type || typeof job_type !== "string")
      throw new Error("Invalid job_type");

    const links = [];

    for (const jobProvider of job.jobProviders) {
      links.push({ source: jobProvider.jobProvider, url: jobProvider.url });
    }

    return {
      job_type: job_type,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      employment_type: job.employmentType,
      links: links,
    };
  }
}

module.exports = RapidAPIConverter;
