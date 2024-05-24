const { connect, close, clearDatabase } = require("./db_handler");

const { JobPost } = require("../schema/JobPost");
const { Link } = require("../schema/Link");

const delete_list = ["links"];

const job_1 = {
  _id: "test_1",
  job_type: "JobType_1",
  title: "Title_1",
  company: "Company_1",
  location: "Location_1",
  description: "Description_1",
};

var job = null;

describe("Link Schema", () => {
  beforeAll(async () => {
    await connect();
    job = await JobPost.create(job_1);
  });

  afterAll(async () => {
    await close();
  });

  afterEach(async () => {
    await clearDatabase(delete_list);
  });

  test("Valid Link", async () => {
    const link = {
      job_post: job._id,
      source: "Example.com",
      url: "http://example.com",
    };
    await expect(Link.create(link)).resolves.not.toThrow();
  });
  test("Invalid JobPost id", async () => {
    const link = {
      job_post: "not valid",
      source: "Example.com",
      url: "http://example.com",
    };
    await expect(Link.create(link)).rejects.toThrow(
      "Link validation failed: job_post: Invalid JobPost"
    );
  });

  test("Invalid Url", async () => {
    const link = {
      job_post: job._id,
      source: "Example.com",
      url: "examplecom",
    };
    await expect(Link.create(link)).rejects.toThrow(
      "Link validation failed: url: Invalid URL"
    );
  });

  test("Duplicate Link", async () => {
    const link = {
      job_post: job._id,
      source: "Example.com",
      url: "example.com",
    };

    await Link.create(link);

    const link_2 = { ...link, url: "example2.com" };

    await expect(Link.create(link_2)).rejects.toThrow();
  });
});
