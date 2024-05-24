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

const delete_list = ["tokens"];

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

describe("Token Schema", () => {
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
  });

  afterAll(async () => {
    await close();
  });

  afterEach(async () => {
    await clearDatabase(delete_list);
  });

  test("Valid Token", async () => {
    const token = {
      annotation: annotation.id,
      token: "Token_1",
    };
    await expect(Token.create(token)).resolves.not.toThrow();
  });
  test("Invalid Token", async () => {
    const token = {
      annotation: new mongoose.Types.ObjectId(),
      token: "Token_1",
    };
    await expect(Token.create(token)).rejects.toThrow(
      "Token validation failed: annotation: Invalid Annotation"
    );
  });
});
