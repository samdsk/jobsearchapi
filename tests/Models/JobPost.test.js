const { connect, close, clearDatabase } = require("../db_handler");

const { JobPost } = require("../../Models/JobPost");
const { default: mongoose } = require("mongoose");
const { DataProvider } = require("../../Models/DataProvider");

const delete_list = ["texts"];

const job_1 = {
  _id: "test_1",
  job_type: "JobType_1",
  title: "Title_1",
  company: "Company_1",
  location: "Location_1",
  text: "Description_1",
  links: [
    {
      source: "source 1",
      url: "example.com",
    },
    {
      source: "source 2",
      url: "http://hhwexample.com",
    },
  ],
  icu_locale_language_tag: "it-IT",
};

let data_provider;

describe("JobPost Model", () => {
  beforeAll(async () => {
    await connect();
    data_provider = await DataProvider.create({ data_provider: "RapidAPI" });
    job_1.data_provider = data_provider._id;
  });

  afterAll(async () => {
    await close();
  });

  afterEach(async () => {
    await clearDatabase(delete_list);
  });

  test("Valid JobPost", async () => {
    await expect(JobPost.create(job_1)).resolves.not.toThrow();
  });

  test("Invalid Data Provider", async () => {
    const job = job_1;

    job.data_provider = new mongoose.Types.ObjectId();
    await expect(JobPost.create(job)).rejects.toThrow(
      "JobPost validation failed: data_provider: Invalid Data Provider"
    );
  });

  test("Invalid url", async () => {
    job_1.links = [
      {
        source: "source 1",
        url: "examplecom",
      },
      {
        source: "source 2",
        url: "http://hhwexample.com",
      },
    ];
    await expect(JobPost.create(job_1)).rejects.toThrow(
      "JobPost validation failed: links: Invalid link url 'examplecom'"
    );
  });

  test("Duplicate source", async () => {
    job_1.links = [
      {
        source: "source 1",
        url: "example.com",
      },
      {
        source: "source 1",
        url: "http://hhwexample.com",
      },
    ];
    await expect(JobPost.create(job_1)).rejects.toThrow(
      "JobPost validation failed: links: Duplicate link source 'source 1'"
    );
  });
});
