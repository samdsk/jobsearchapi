const { connect, close, clearDatabase } = require("./db_handler");

const { Annotation } = require("../schemas/Annotation");
const { Annotator } = require("../schemas/Annotator");
const { Role } = require("../schemas/Role");
const { Background } = require("../schemas/Background");
const { Domain } = require("../schemas/Domain");
const { JobPost } = require("../schemas/JobPost");
const { Label } = require("../schemas/Label");

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

var role = null;
var background = null;
var annotator = null;
var domain = null;
var job = null;
var label = null;
var annotation = null;

describe("Background schemas", () => {
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
      tokens: ["token1", "token2"],
    };

    annotation = await Annotation.create(annotation_1);
  });

  afterAll(async () => {
    await close();
  });

  afterEach(async () => {
    await clearDatabase(delete_list);
  });

  test("Delete Background and cascade delete to Annotator and Annotations", async () => {
    await expect(
      Background.deleteOne({ _id: background._id })
    ).resolves.not.toThrow();

    expect(await Background.findById(background._id)).toBe(null);
    expect(await Annotation.findById(annotation._id)).toBe(null);
    expect(await Annotator.findById(annotator._id)).toBe(null);
  });

  test("Cant delete Background without an id", async () => {
    await expect(Background.deleteOne({ background: "Role" })).rejects.toThrow(
      "usage: Background.deleteOne({_id:id})"
    );
  });
});
