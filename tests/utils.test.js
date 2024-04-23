const mongoose = require("mongoose");
const { getResultFiles, getJSONFromFile, saveToJSON } = require("../lib/utils");
const generateId = require("../db/generateID");
const { insertJob } = require("../db/InsertJob");

require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL_DUP_TEST);
  console.log("connected");
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) await collection.drop();
});

describe("asd", () => {
  it("Should not contain files that doesn't start with results", async () => {
    const files = await getResultFiles();
    const n = files.filter((file) => !file.startsWith("results"));
    expect(n.length).toBe(0);
  });
});
