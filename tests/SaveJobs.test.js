const mongoose = require("mongoose");
const { setJobSchemaID } = require("../db/InsertJob");
const JobSchema = require("../db/schema/JobSchema");
require("dotenv").config();

let job_example = {
  _id: "RixyLG8sbix0LCAsRSxuLGQsICxXLGUsYiwgLEQsZSx2LGUsbCxvLHAsZSxyLEYsbyxyLGIsZSxzLCA=",
  title: "Front End Web Developer",
  company: "Forbes Books",
  description: "FRONT END WEB DEVELOPER...",
  image:
    "https://fonts.gstatic.com/s/i/googlematerialicons/event_available/v16/gm_grey-24dp/1x/gm_event_available_gm_grey_24dp.png",
  location: "Anywhere",
  employmentType: "Internship",
  timeAgoPosted: "2 days ago",
  salaryRange: "",
  jobProviders: [
    {
      jobProvider: "LinkedIn",
      url: "https://www.linkedin.com/jobs/view/front-end-web-developer-at-forbes-books-3785868521?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
    },
    {
      jobProvider: "Indeed",
      url: "https://www.indeed.com/viewjob?jk=b3b038b7ac29448c&utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
    },
    {
      jobProvider: "ZipRecruiter",
      url: "https://www.ziprecruiter.com/c/Forbes-Books/Job/Front-End-Web-Developer/-in-Charleston,SC?jid=76ec370979d206e0&utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic",
    },
  ],
};

describe("Change id field to _id", () => {
  it("should change key id to _id", () => {
    const id = "1234567890";
    const job = {
      id: id,
    };

    expect(setJobSchemaID(job)._id).toEqual(id);
  });
});

describe("insert a job details to db", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
    console.log("connected");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) await collection.deleteMany({});
  });

  it("should insert a job to the db", async () => {
    job_example.searchDate = Date.now();
    await JobSchema.create(job_example);
    const jobRes = await JobSchema.findById(job_example._id);

    expect(jobRes._id).toEqual(job_example._id);
  });
});
