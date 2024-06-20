const { connect, close, clearDatabase } = require("../db_handler");

const { Text } = require("../../Models/Text");
const { default: mongoose } = require("mongoose");
const { DataProvider } = require("../../Models/DataProvider");
const { Language } = require("../../Models/Language");

const delete_list = ["texts"];

const text = {
  _id: "test_1",
  text: "Description_1",
  title: "Title_1",
  links: [
    {
      source: "source 1",
      url: "example.com",
    },
    {
      source: "source 2",
      url: "http://hhwexample.com",
    },
  ],
};

let data_provider;
let language;

describe("Text Model", () => {
  beforeAll(async () => {
    await connect();
    data_provider = await DataProvider.create({ data_provider: "RapidAPI" });
    text.data_provider = data_provider._id;
    language = await Language.create({ icu_locale: "en-US" });
    text.language = language._id;
  });

  afterAll(async () => {
    await close();
  });

  afterEach(async () => {
    await clearDatabase(delete_list);
  });

  test("Valid Text", async () => {
    await expect(Text.create(text)).resolves.not.toThrow();
  });

  test("Invalid Data Source", async () => {
    const text_1 = text;

    text_1.data_provider = new mongoose.Types.ObjectId();
    await expect(Text.create(text_1)).rejects.toThrow(
      "Text validation failed: data_provider: Invalid Data Provider"
    );
  });

  test("Invalid url", async () => {
    text.links = [
      {
        source: "source 1",
        url: "examplecom",
      },
      {
        source: "source 2",
        url: "http://hhwexample.com",
      },
    ];
    await expect(Text.create(text)).rejects.toThrow(
      "Text validation failed: links: Invalid link url 'examplecom'"
    );
  });

  test("Duplicate source", async () => {
    text.links = [
      {
        source: "source 1",
        url: "example.com",
      },
      {
        source: "source 1",
        url: "http://hhwexample.com",
      },
    ];
    await expect(Text.create(text)).rejects.toThrow(
      "Text validation failed: links: Duplicate link source 'source 1'"
    );
  });
});
