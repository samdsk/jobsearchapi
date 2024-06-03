const LabelService = require("../../lib/Services/LabelService");
const AnnotationService = require("../../lib/Services/AnnotationService");
const TransactionWrapper = require("../../lib/TransactionWrapper");
const { Label } = require("../../schemas/Label");

describe("Label Service", () => {
  beforeEach(() => jest.restoreAllMocks());

  it("create a role", async () => {
    const spyLabel = jest
      .spyOn(Label, "create")
      .mockImplementation(async () => Promise.resolve());

    const label = {};
    await LabelService.create(label);

    expect(spyLabel).toHaveBeenCalled();
  });

  it("delete Label cascades deletes to Annotations with session", async () => {
    const spyLabel = jest
      .spyOn(Label, "deleteOne")
      .mockImplementation(async () => Promise.resolve());

    const spyAnnotation = jest
      .spyOn(AnnotationService, "deleteAnnotations")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const session = "session";
    await LabelService.deleteLabel(id, session);

    expect(spyLabel).toHaveBeenCalledWith({ _id: id }, { session: session });
    expect(spyAnnotation).toHaveBeenCalledWith({ label: id }, session);
  });

  it("delete Label cascades deletes to Annotations without session", async () => {
    const spyTransactionWrapper = jest
      .spyOn(TransactionWrapper, "transactionWrapper")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    await LabelService.deleteLabel(id);

    expect(spyTransactionWrapper).toHaveBeenCalled();
  });
});
