const { connect, close, clearDatabase } = require("./db_handler");

const { Annotation } = require("../schemas/Annotation");
const { Annotator } = require("../schemas/Annotator");
const { Role } = require("../schemas/Role");
const { Background } = require("../schemas/Background");
const { Domain } = require("../schemas/Domain");
const { JobPost } = require("../schemas/JobPost");
const { Label } = require("../schemas/Label");

const delete_list = ["jobposts"];

const role_1 = {
  role: "Role_1",
  reliability_score: 3,
};

const background_1 = {
  background: "Background_1",
};

const annotator_1 = {
  email: "asd@asd.com",
};

const domain_1 = {
  domain: "Domain_1",
};

const label_1 = {
  label: "Label_1",
};

const job_1 = {
  _id: "test_1",
  job_type: "JobType_1",
  title: "Title_1",
  company: "Company_1",
  location: "Location_1",
  description: "Description_1",
};

var role = null;
var background = null;
var annotator = null;
var domain = null;
var label = null;
var annotation = null;

describe("JobPost Schema", () => {
  beforeAll(async () => {
    await connect();
    background = await Background.create(background_1);
    role = await Role.create(role_1);

    annotator_1.role = role.id;
    annotator_1.background = background.id;

    annotator = await Annotator.create(annotator_1);
    domain = await Domain.create(domain_1);
    label = await Label.create(label_1);
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

  test("Delete JobPost and cascade delete to Annotation, Links and Tokens", async () => {
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
    const job = await JobPost.create(job_1);

    const annotation_1 = {
      source: job.id,
      annotator: annotator.id,
      label: label.id,
      reason: "Reason_1",
      domain: domain.id,
    };

    annotation = await Annotation.create(annotation_1);

    await expect(JobPost.deleteOne({ _id: job._id })).resolves.not.toThrow();

    expect(await JobPost.findById(job._id)).toBe(null);
    expect(await Annotation.findById(annotation._id)).toBe(null);
  });

  test("Cant delete JobPost without an id", async () => {
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
    const job = await JobPost.create(job_1);

    const annotation_1 = {
      source: job.id,
      annotator: annotator.id,
      label: label.id,
      reason: "Reason_1",
      domain: domain.id,
    };

    annotation = await Annotation.create(annotation_1);

    await expect(JobPost.deleteOne({ job_type: "jobtype" })).rejects.toThrow(
      "usage: JobPost.deleteOne({_id:id})"
    );
  });
});
