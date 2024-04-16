const InsertJob = require("../db/InsertJob");
const { logResultsToJSONFile } = require("./resultsLogger");

class Collector {
  constructor(RequestSender) {
    this.RequestSender = RequestSender;
  }

  async searchJobsByType(JobType, RequestOptions) {
    const searchDate = new Date(Date.now());
    const filenameSearchJobResults = `results_${JobType}`;
    const filenameFullResponses = `results_${JobType}_fullresponse`;

    let searchResults = {
      jobType: JobType,
      searchDate: searchDate,
      jobs: [],
    };

    let data = await this.RequestSender.sendJobSearchRequest(
      JobType,
      RequestOptions
    );

    // collecting actual response data for debug purposes
    let actualResponseData = [];
    actualResponseData.push(data);

    searchResults.jobs = searchResults.jobs.concat(data.jobs);
    searchResults.location = data.location;
    searchResults.language = data.language;

    let count = 1;

    // limiting requests to 4 using count variable

    while (data.jobCount && data.jobCount >= 10 && count < 4) {
      const index = parseInt(data.index, 10);

      data = await this.RequestSender.sendJobSearchRequest(
        JobType,
        index + 10,
        RequestOptions
      );

      actualResponseData.push(data);
      searchResults.jobs = searchResults.jobs.concat(data.jobs);

      count++;
    }

    // inserting jobs to db
    await InsertJob.insertAllJobs(searchResults);

    // logging search results
    await logResultsToJSONFile(
      filenameSearchJobResults,
      searchDate,
      searchResults
    );

    // logging full response
    await logResultsToJSONFile(
      filenameFullResponses,
      searchDate,
      actualResponseData
    );

    return {
      jobType: JobType,
      searchDate: searchDate,
      collected: searchResults.jobs.length,
      location: searchResults.location,
      language: searchResults.language,
      actualData: actualResponseData,
    };
  }

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
