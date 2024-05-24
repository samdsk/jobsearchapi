const { connect, close, clearDatabase } = require("./db_handler");

const { Link } = require("../schema/Link");
const { Annotation } = require("../schema/Annotation");
const { Annotator } = require("../schema/Annotator");
const { Role } = require("../schema/Role");
const { Background } = require("../schema/Background");
const { Domain } = require("../schema/Domain");
const { JobPost } = require("../schema/JobPost");
const { Label } = require("../schema/Label");
const { Token } = require("../schema/Token");

const delete_list = [""];

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

const token_1 = {
  token: "Token_1",
};

var role = null;
var background = null;
var annotator = null;
var domain = null;
var job = null;
var label = null;
var annotation = null;
var link = null;
var token = null;

describe("Annotation Schema", () => {
  beforeAll(async () => {
    await connect();
    background = await Background.create(background_1);
    role = await Role.create(role_1);

    annotator_1.role = role.id;
    annotator_1.background = background.id;

    annotator = await Annotator.create(annotator_1);
    domain = await Domain.create(domain_1);
    label = await Label.create(label_1);
    job = await JobPost.create(job_1);

    const annotation_1 = {
      source: job.id,
      annotator: annotator.id,
      label: label.id,
      reason: "Reason_1",
      domain: domain.id,
    };

    annotation = await Annotation.create(annotation_1);

    token_1.annotation = annotation._id;

    token = await Token.create(token_1);

    const link_1 = {
      job_post: job._id,
      source: "Example.com",
      url: "http://example.com",
    };

    link = await Link.create(link_1);
  });

  afterAll(async () => {
    await close();
  });

  afterEach(async () => {
    await clearDatabase(delete_list);
  });

  test("Delete JobPost and cascade delete to Annotation, Links and Tokens", async () => {
    await expect(JobPost.deleteOne({ _id: job._id })).resolves.not.toThrow();

    expect(await JobPost.findById(job._id)).toBe(null);
    expect(await Annotation.findById(annotation._id)).toBe(null);
    expect(await Link.findById(link._id)).toBe(null);
    expect(await Token.findById(token._id)).toBe(null);
  });

  test("Cant delete JobPost without an id", async () => {
    await expect(JobPost.deleteOne({ job_type: "jobtype" })).rejects.toThrow(
      "usage: JobPost.deleteOne({_id:id})"
    );
  });
});
