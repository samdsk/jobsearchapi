const BackgroundService = require("../lib/BackgroundService");
const TransactionWrapper = require("../lib/TransactionWrapper");
const { Background } = require("../schemas/Background");

const AnnotatorService = require("../lib/AnnotatorService");

describe("Background Service", () => {
  it("create a background", async () => {
    const spyRole = jest
      .spyOn(Background, "create")
      .mockImplementation(async () => Promise.resolve());

    const background = {};
    await BackgroundService.create(background);

    expect(spyRole).toHaveBeenCalled();
  });

  it("delete Background cascades deletes to Annotators with session", async () => {
    const spyBackground = jest
      .spyOn(Background, "deleteOne")
      .mockImplementation(async () => Promise.resolve());

    const spyAnnotator = jest
      .spyOn(AnnotatorService, "deleteAnnotators")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const session = "session";
    await BackgroundService.deleteBackground(id, session);

    expect(spyBackground).toHaveBeenCalledWith(
      { _id: id },
      { session: session }
    );
    expect(spyAnnotator).toHaveBeenCalledWith({ background: id }, session);
  });

  it("delete Background cascades deletes to Annotators without session", async () => {
    const spyTransactionWrapper = jest
      .spyOn(TransactionWrapper, "transactionWrapper")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    await BackgroundService.deleteBackground(id);

    expect(spyTransactionWrapper).toHaveBeenCalled();
  });
});
