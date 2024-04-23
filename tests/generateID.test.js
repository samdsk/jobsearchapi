const generateID = require("../db/generateID");
const crypto = require("crypto");
const fs = require("fs/promises");

describe("generate unique ID", () => {
  const job = {
    title: "Title",
    company: "Company    Name",
    location: "   LOCAtion   ",
  };
  it("should generate string from job containing title, company and location without spaces and all in lowercase", () => {
    const res = generateID.jobToStringTitleCompanyLocation(job);
    const expectedString = "titlecompanynamelocation";
    expect(expectedString).toEqual(res);
  });
  it("should generate an id in base64", () => {
    const res = generateID.generateHash(job);
    const stringToHash = "titlecompanynamelocation";
    const expectedString = crypto
      .createHash("sha512")
      .update(stringToHash)
      .digest("base64");

    expect(expectedString).toEqual(res);
  });

  it("should process a list of job objs", async () => {
    const resString = await fs.readFile("./tests/duplicates.json", {
      encoding: "utf-8",
      flag: "r",
    });

    const jobs = JSON.parse(resString);

    const ids = new Set();

    for (const job of jobs) {
      const temp = generateID.generateHash(job);
      ids.add(temp);
    }

    expect(jobs.length).toEqual(ids.size);
  });
});
