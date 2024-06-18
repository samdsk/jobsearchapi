const ResultLogger = require("./resultsLogger");
const Logger = require("./logger");
require("dotenv").config();

const DEFAULT_LIMIT = 3;
const LIMIT = process.env.REQUEST_LIMIT || DEFAULT_LIMIT;

/**
 * collects job descriptions from Rapid API's Job Search API
 */
class Collector {
  /**
   * @param {SearchRequestSender} requires a Class with sendJobSearchRequest method
   */
  constructor(SearchRequestSender, JobPostController) {
    this.SearchRequestSender = SearchRequestSender;
    this.JobPostController = JobPostController;
  }

  async logResults(results) {
    // logging search results
    await ResultLogger.logResultsToJSONFile(
      `results_${results.jobType}`,
      results.searchDate,
      results
    );
  }

  async logFullResponse(jobType, date, response) {
    await ResultLogger.logResultsToJSONFile(
      `full_results/${jobType}`,
      date,
      response
    );
  }

  /**
   * Collect Job descriptions for the given JobType
   * @param {String} JobType which type of job you want to search
   * @param {Object} [RequestOptions] Object which contains optionalParams of sendJobSearchRequest method
   * @returns an Object containing a summary of collected data and an array of actual data obtained from API
   */
  async searchJobsByType(JobType, RequestOptions) {
    const searchDate = new Date(Date.now());

    let searchResults = {
      jobType: JobType,
      searchDate: searchDate,
      jobs: [],
    };

    // collecting actual response data for debug purposes
    let actualResponseData = [];

    let jobCount = 10;
    let index = RequestOptions?.index || 0;
    let insertedCount = 0;

    let requestCount = 0;

    // use REQUEST_LIMIT env variable to vary the limit
    do {
      let data = await this.SearchRequestSender.sendJobSearchRequest(
        JobType,
        index,
        RequestOptions
      );

      insertedCount += await this.insertJobs(data.jobs, JobType);

      actualResponseData.push(data);
      searchResults.jobs = searchResults.jobs.concat(data.jobs);

      if (!searchResults?.location) searchResults.location = data.location;
      if (!searchResults?.language) searchResults.language = data.language;

      index = parseInt(data.index, 10);
      index += 10;
      jobCount = parseInt(data.jobCount, 10);
      requestCount++;
    } while (jobCount >= 10 && requestCount < LIMIT);

    await this.logResults(searchResults);
    await this.logFullResponse(JobType, searchDate, actualResponseData);

    // inserting jobs to db

    Logger.info(
      `Collected: ${
        searchResults.jobs.length
      } and inserted ${insertedCount} duplicates:${
        searchResults.jobs.length - insertedCount
      } to DB by JobType: ${JobType} Location:${
        searchResults.location
      } Language:${searchResults.language}`
    );

    return {
      jobType: JobType,
      searchDate: searchDate,
      collected: searchResults.jobs.length,
      inserted: insertedCount,
      location: searchResults.location,
      language: searchResults.language,
    };
  }
  /**
   *
   * @param {[String]} JobTypes a list of strings containing job types to search
   * @param {Object} [RequestOptions] Object which contains optionalParams of sendJobSearchRequest method
   * @returns [Object] returns an array of results per job type
   */
  async searchJobTypeList(JobTypes, RequestOptions) {
    const results = [];
    for (const job_type of JobTypes) {
      const tempRes = await this.searchJobsByType(job_type, RequestOptions);
      results.push({ jobType: job_type, response: tempRes });
    }

    return results;
  }

  async insertJobs(jobs, job_type) {
    return await this.JobPostController.insertListOfJobs(jobs, job_type);
  }
}

module.exports = Collector;
