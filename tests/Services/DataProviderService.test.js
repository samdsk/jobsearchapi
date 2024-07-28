const DataProviderService = require("../../Services/DataProviderService");
const { DataProvider } = require("../../Models/DataProvider");

describe("DataProvider Service", () => {
  beforeEach(() => jest.restoreAllMocks());

  it("create a data provider", async () => {
    const spyRole = jest
      .spyOn(DataProvider, "create")
      .mockImplementation(async () => Promise.resolve());

    const data_provider = "RapidAPI";
    await DataProviderService.create(data_provider);

    expect(spyRole).toHaveBeenCalled();
  });
  it("invalid data provider", async () => {
    const spyRole = jest
      .spyOn(DataProvider, "create")
      .mockImplementation(async () => Promise.resolve());

    const data_provider = 123;

    await expect(DataProviderService.create(data_provider)).rejects.toThrow(
      "data_provider must be a string!"
    );
  });

  it("get data providers id from name", async () => {
    const mockedDataProviderID = "mocked id";
    const spyRole = jest.spyOn(DataProvider, "findOne").mockReturnValue({
      select: async () => Promise.resolve({ _id: mockedDataProviderID }),
    });

    const data_provider = "RapidAPI";
    const result = await DataProviderService.getIDByName(data_provider);

    expect(spyRole).toHaveBeenCalled();
    expect(result).toEqual(mockedDataProviderID);
  });
});
