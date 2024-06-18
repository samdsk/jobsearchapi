const logger = require("../lib/logger");

class JobPostController {
  constructor(Converter, JobPostService) {
    this.Converter = Converter;
    this.JobPostService = JobPostService;
  }

  async insertJob(job, job_type) {
    try {
      const jobPost = this.Converter.convert(job, job_type);
      return await this.JobPostService.create(jobPost);
    } catch (err) {
      logger.debug(JSON.stringify(err.message));
      return null;
    }
  }

  async insertListOfJobs(jobs, job_type) {
    let count = 0;

    for (const job of jobs) {
      const res = await this.insertJob(job, job_type);
      if (res) count++;
    }

    return count;
  }
}

module.exports = JobPostController;
