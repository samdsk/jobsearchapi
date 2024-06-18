const { connect, close, clearDatabase } = require("../db_handler");

const { JobPost } = require("../../Models/JobPost");

const delete_list = ["jobposts"];

const job_1 = {
  _id: "test_1",
  job_type: "JobType_1",
  title: "Title_1",
  company: "Company_1",
  location: "Location_1",
  description: "Description_1",
};

describe("JobPost Schema", () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await close();
  });

  afterEach(async () => {
    await clearDatabase(delete_list);
  });

  test("Valid JobPost", async () => {
    job_1.links = [
      {
        source: "source 1",
        url: "example.com",
      },
      {
        source: "source 2",
        url: "http://hhwexample.com",
      },
    ];
    await expect(JobPost.create(job_1)).resolves.not.toThrow();
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
