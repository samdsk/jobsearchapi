const { connect, close, clearDatabase } = require("./db_handler");
const mongoose = require("mongoose");

const { Annotator } = require("../schema/Annotator");
const { Role } = require("../schema/Role");
const { Background } = require("../schema/Background");
const { Domain } = require("../schema/Domain");
const { JobPost } = require("../schema/JobPost");
const { Label } = require("../schema/Label");
const { Annotation } = require("../schema/Annotation");
const { Token } = require("../schema/Token");

const delete_list = ["annotations"];

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
  });

  afterAll(async () => {
    await close();
  });

  afterEach(async () => {
    await clearDatabase(delete_list);
  });

  test("Valid Annotation", async () => {
    const annotation = {
      source: job._id,
      annotator: annotator._id,
      label: label._id,
      reason: "Reason_1",
      domain: domain._id,
    };

    await expect(Annotation.create(annotation)).resolves.not.toThrow();
  });
  test("Delete cascade Tokens", async () => {
    const annotation = {
      source: job._id,
      annotator: annotator._id,
      label: label._id,
      reason: "Reason_1",
      domain: domain._id,
    };

    const res = await Annotation.create(annotation);

    await expect(Annotation.deleteOne({ _id: res._id })).resolves.not.toThrow();

    expect(await Annotation.findById(res._id)).toBe(null);
    expect(await Token.findOne({ annotation: res._id })).toBe(null);
  });
  test("Cant delete without an ID", async () => {
    await expect(
      Annotation.deleteOne({ annotator: annotator._id })
    ).rejects.toThrow("usage: Annotation.deleteOne({_id:id})");
  });
  test("Duplicate Annotation", async () => {
    const annotation = {
      source: job.id,
      annotator: annotator.id,
      label: label.id,
      reason: "Reason_1",
      domain: domain.id,
    };
    const annotation_2 = { ...annotation, reason: "Reason_2" };

    await Annotation.create(annotation);

    await expect(Annotation.create(annotation_2)).rejects.toThrow();
  });
  test("Invalid source", async () => {
    const annotation = {
      source: "job.id",
      annotator: annotator.id,
      label: label.id,
      reason: "Reason_1",
      domain: domain.id,
    };
    await expect(Annotation.create(annotation)).rejects.toThrow(
      "Annotation validation failed: source: Invalid JobPost"
    );
  });
  test("Invalid annotator", async () => {
    const annotation = {
      source: job.id,
      annotator: new mongoose.Types.ObjectId(),
      label: label.id,
      reason: "Reason_1",
      domain: domain.id,
    };
    await expect(Annotation.create(annotation)).rejects.toThrow(
      "Annotation validation failed: annotator: Invalid Annotator"
    );
  });
  test("Invalid label", async () => {
    const annotation = {
      source: job.id,
      annotator: annotator.id,
      label: new mongoose.Types.ObjectId(),
      reason: "Reason_1",
      domain: domain.id,
    };
    await expect(Annotation.create(annotation)).rejects.toThrow(
      "Annotation validation failed: label: Invalid Label"
    );
  });
  test("Invalid domain", async () => {
    const annotation = {
      source: job.id,
      annotator: annotator.id,
      label: label.id,
      reason: "Reason_1",
      domain: new mongoose.Types.ObjectId(),
    };
    await expect(Annotation.create(annotation)).rejects.toThrow(
      "Annotation validation failed: domain: Invalid Domain"
    );
  });
});
