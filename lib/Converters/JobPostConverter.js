const Converter = require("./Converter");

class JobPostConverter extends Converter {
  static convert(job, job_type) {
    if (!job_type || typeof job_type !== "string")
      throw new Error("Invalid job_type");

    const links = JobPostConverter.buildLinksObject(job);

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

    for (const link of job.links) {
      if (!set.has(link.source))
        links.push({ source: link.source, url: link.url });

      set.add(link.source);
    }
    return links;
  }
}

module.exports = JobPostConverter;
