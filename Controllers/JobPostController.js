const CollectorLogger = require("winston").loggers.get("Collector");
const JobPost = require("../Models/JobPost");
const { searchMultiple, searchSingle } = require("./CommonControllerMethods");

class JobPostController {
  constructor(Converter, JobPostService) {
    this.Converter = Converter;
    this.JobPostService = JobPostService;
  }

  async insertJob(job, job_type, language) {
    try {
      const jobPost = this.Converter.convert(job, job_type, language);
      return await this.JobPostService.create(jobPost);
    } catch (err) {
      console.error(err);
      CollectorLogger.debug(JSON.stringify(err.message));
      return null;
    }
  }

  async insertListOfJobs(jobs, job_type, language) {
    let count = 0;

    for (const job of jobs) {
      const res = await this.insertJob(job, job_type, language);
      if (res) count++;
    }

    return count;
  }
}

const searchJobPosts = async (req, res, next) => {
  try {
    const result = await searchMultiple(req, JobPost.JobPost);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const getJobPost = async (req, res, next) => {
  try {
    const result = await searchSingle(req, JobPost.JobPost);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  JobPostController,
  searchJobPosts,
  getJobPost,
};
