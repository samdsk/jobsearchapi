const { connect, close, clearDatabase } = require("../db_handler");

const { DataProvider } = require("../../Models/DataProvider");

const delete_list = ["dataproviders"];

describe("DataProvider Model", () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await close();
  });

  afterEach(async () => {
    await clearDatabase(delete_list);
  });

  test("Valid DataProvider", async () => {
    const data_provider = {
      data_provider: "DataProvider1",
    };
    await expect(DataProvider.create(data_provider)).resolves.not.toThrow();
  });

  test("Duplicate DataProvider", async () => {
    const data_provider = {
      data_provider: "DataProvider1",
    };

    await DataProvider.create(data_provider);
    await DataProvider.syncIndexes();

    try {
      await DataProvider.create(data_provider);
    } catch (e) {
      expect(e.message.startsWith("E11000 duplicate")).toBe(true);
    }
  });
});
