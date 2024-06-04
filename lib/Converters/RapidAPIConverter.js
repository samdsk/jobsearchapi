const Converter = require("./Converter");

class RapidAPIConverter extends Converter {
  static convert(job, job_type) {
    if (!job_type || typeof job_type !== "string")
      throw new Error("Invalid job_type");

    const links = RapidAPIConverter.buildLinksObject(job);

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

  static buildLinksObject(job) {
    const links = [];
    const set = new Set();

    for (const jobProvider of job.jobProviders) {
      if (!set.has(jobProvider.jobProvider))
        links.push({ source: jobProvider.jobProvider, url: jobProvider.url });

      set.add(jobProvider.jobProvider);
    }
    return links;
  }
}

module.exports = RapidAPIConverter;
