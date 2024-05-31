const { connect, close, clearDatabase } = require("./db_handler");
const mongoose = require("mongoose");

const { Annotator } = require("../schemas/Annotator");
const { Role } = require("../schemas/Role");
const { Background } = require("../schemas/Background");

const delete_list = ["annotators"];

const role_1 = {
  role: "Role_1",
  reliability_score: 3,
};

const background_1 = {
  background: "Background_1",
};

var role = null;
var background = null;

describe("Annotator schemas", () => {
  beforeAll(async () => {
    await connect();
    background = await Background.create(background_1);
    role = await Role.create(role_1);
  });

  afterAll(async () => {
    await close();
  });

  afterEach(async () => {
    await clearDatabase(delete_list);
  });

  test("Valid Annotator", async () => {
    const annotator = {
      role: role._id,
      email: "name@example.com",
      background: background._id,
    };
    await expect(Annotator.create(annotator)).resolves.not.toThrow();
  });

  test("Invalid role id", async () => {
    const annotator = {
      role: new mongoose.Types.ObjectId(),
      email: "name@example.com",
      background: background._id,
    };
    await expect(Annotator.create(annotator)).rejects.toThrow(
      "Annotator validation failed: role: Invalid Role"
    );
  });

  test("Invalid background id", async () => {
    const annotator = {
      role: role._id,
      email: "name@example.com",
      background: new mongoose.Types.ObjectId(),
    };
    await expect(Annotator.create(annotator)).rejects.toThrow(
      "Annotator validation failed: background: Invalid Background"
    );
  });

  test("Invalid email", async () => {
    const annotator = {
      role: role._id,
      email: "nameatexample.com",
      background: background._id,
    };
    await expect(Annotator.create(annotator)).rejects.toThrow(
      "Annotator validation failed: email: Invalid Email"
    );
  });
});
