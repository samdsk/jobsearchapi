class JobPostController {
  constructor(Converter, JobPostService) {
    this.Converter = Converter;
    this.JobPostService = JobPostService;
  }

  async insertJob(job, job_type) {
    const jobPost = this.Converter.convert(job, job_type);
    try {
      return await this.JobPostService.create(jobPost);
    } catch (err) {
      if (err.message && err.message.startsWith("E11000")) return null;
      else throw err;
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
