const InsertJob = require("../db/InsertJob");
const { logResultsToJSONFile } = require("./resultsLogger");

const LIMIT = 5;

/**
 * collects job descriptions from Rapid API's Job Search API
 */
class Collector {
  /**
   * @param {SearchRequestSender} requires a Class with sendJobSearchRequest method
   */
  constructor(SearchRequestSender) {
    this.SearchRequestSender = SearchRequestSender;
  }

  /**
   * Collect Job descriptions for the given JobType
   * @param {String} JobType which type of job you want to search
   * @param {Object} [RequestOptions] Object which contains optionalParams of sendJobSearchRequest method
   * @returns an Object containing a summary of collected data and an array of actual data obtained from API
   */
  async searchJobsByType(JobType, RequestOptions) {
    const searchDate = new Date(Date.now());
    const filenameSearchJobResults = `results_${JobType}`;
    const filenameFullResponses = `fullresponse_${JobType}`;
    let index = RequestOptions?.index || 0;

    let searchResults = {
      jobType: JobType,
      searchDate: searchDate,
      jobs: [],
    };

    let data = await this.SearchRequestSender.sendJobSearchRequest(
      JobType,
      index,
      RequestOptions
    );

    // collecting actual response data for debug purposes
    let actualResponseData = [];
    actualResponseData.push(data);

    searchResults.jobs = searchResults.jobs.concat(data.jobs);
    searchResults.location = data.location;
    searchResults.language = data.language;

    let count = 0;

    // limiting requests to 5 using count variable

    while (data.jobCount && data.jobCount >= 10 && count < LIMIT) {
      index = parseInt(data.index, 10);
      data = await this.SearchRequestSender.sendJobSearchRequest(
        JobType,
        index + 10,
        RequestOptions
      );

      actualResponseData.push(data);
      searchResults.jobs = searchResults.jobs.concat(data.jobs);

      count++;
    }

    // inserting jobs to db
    const insertedCount = await InsertJob.insertAllJobs(searchResults);

    // logging search results
    await logResultsToJSONFile(
      filenameSearchJobResults,
      searchDate,
      searchResults
    );

    // logging full response
    // await logResultsToJSONFile(
    //   filenameFullResponses,
    //   searchDate,
    //   actualResponseData
    // );

    console.log(
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
    for (const job of JobTypes) {
      const tempRes = await this.searchJobsByType(job, RequestOptions);
      results.push({ jobType: job, response: tempRes });
    }

    return results;
  }
}

module.exports = Collector;
