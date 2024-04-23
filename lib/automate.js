const Collector = require("./collector");
const SearchRequestSender = require("./searchRequestSender");
require("dotenv").config();

class Automate {
  constructor(keys, config) {
    if (!(keys instanceof Set)) throw new Error("keys must be a set");
    this.keys = keys;
    this.config = config;
  }

  async collect(jobTypesList, options = {}) {
    const senderOptions = {
      API_URL: this.config?.API_URL,
      API_HOST: this.config?.API_HOST,
    };

    const results = [];

    const sender = new SearchRequestSender(senderOptions);
    const collector = new Collector(sender);

    let flag = true;

    while (flag && this.keys.size > 0 && jobTypesList.length > 0) {
      for (const key of this.keys) {
        try {
          sender.API_KEY = key;

          for (const jobType of jobTypesList) {
            console.log(`key ${key} job ${jobType}`);

            const response = await collector.searchJobsByType(jobType, options);
            console.log(response);

            results.push(response);
          }

          flag = false;
          if (!flag) break;
        } catch (error) {
          if (error.status === 429) {
            console.log(`The key ${key} isn't valid anymore! removing...`);
            this.keys.delete(key);

            console.log(this.keys);

            console.log(
              `Last job type ${error.jobType}, last index ${error.index}`
            );

            options.index = error.index;

            const indexOfJob = jobTypesList.indexOf(error.jobType);
            if (indexOfJob > 0) {
              console.log(`Slicing the job types list until ${indexOfJob}`);

              jobTypesList = jobTypesList.slice(indexOfJob);
            }

            flag = true;
          } else {
            throw error;
          }
        }
      }
    }

    return results;
  }
}

module.exports = Automate;
