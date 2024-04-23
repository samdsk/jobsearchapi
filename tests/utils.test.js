const mongoose = require("mongoose");
const { getResultFiles, getJSONFromFile, saveToJSON } = require("../lib/utils");
const generateId = require("../db/generateID");
const { insertJob } = require("../db/InsertJob");

require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL_DUP_TEST);
  console.log("connected");
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) await collection.drop();
});

describe("asd", () => {
  it("Should not contain files that doesn't start with results", async () => {
    const files = await getResultFiles();
    const n = files.filter((file) => !file.startsWith("results"));
    expect(n.length).toBe(0);
  });

  it.skip("asd", async () => {
    const files = await getResultFiles();
    const summary = [];

    for (const file of files) {
      const jobs = await getJSONFromFile("results/" + file);

      const additionalDetails = {
        searchJobType: jobs.jobType,
        searchLocation: jobs.location,
        searchLanguage: jobs.language,
        searchDate: jobs.searchDate
          ? new Date(jobs.searchDate)
          : new Date(Date.now()),
      };
      let count = 0;
      for (const job of jobs.jobs) {
        const added = await insertJob(job, additionalDetails);
        if (added) count++;
      }

      summary.push({
        collected: jobs.jobs.length,
        inserted: count,
        jobType: jobs.jobType,
        location: jobs.location,
        language: jobs.language,
        searchDate: jobs.searchDate,
      });
    }

    // console.log(idSet);
    console.log(summary);
  });
});
