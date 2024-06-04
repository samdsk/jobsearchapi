const { Annotator } = require("../../schemas/Annotator");
const AnnotatorService = require("../../lib/Services/AnnotatorService");
const AnnotationService = require("../../lib/Services/AnnotationService");
const TransactionWrapper = require("../../lib/TransactionWrapper");

const opts = { runValidators: true };

describe("Annotator Service", () => {
  beforeEach(() => jest.restoreAllMocks());
  it("creates annotator", async () => {
    const spy = jest
      .spyOn(Annotator, "create")
      .mockImplementation(async () => Promise.resolve());

    const annotator = {
      role: "role.id",
      email: "name@example.com",
      background: "background.id",
    };

    await AnnotatorService.create(annotator);

    expect(spy).toHaveBeenCalled();
  });

  it("update annotator email", async () => {
    const spy = jest
      .spyOn(Annotator, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "something";

    const email = "asd@asd.com";

    await AnnotatorService.updateEmail(id, email);

    expect(spy).toHaveBeenCalledWith({ _id: id }, { email: email }, opts);
  });
  it("update annotator role", async () => {
    const spy = jest
      .spyOn(Annotator, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "something";

    const role = "newrole";

    await AnnotatorService.updateRole(id, role);

    expect(spy).toHaveBeenCalledWith({ _id: id }, { role: role }, opts);
  });
  it("update annotator background", async () => {
    const spy = jest
      .spyOn(Annotator, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "something";

    const background = "newbackground";

    await AnnotatorService.updateBackground(id, background);

    expect(spy).toHaveBeenCalledWith(
      { _id: id },
      { background: background },
      opts
    );
  });

  it("delete Annotator and cascade to AnnotationService with session", async () => {
    const spyAnnotator = jest
      .spyOn(Annotator, "deleteOne")
      .mockImplementation(async () => Promise.resolve());

    const spyAnnotation = jest
      .spyOn(AnnotationService, "deleteAnnotations")
      .mockImplementation(async () => Promise.resolve());

    const id = "something";
    const session = "session";
    await AnnotatorService.deleteAnnotator(id, session);

    expect(spyAnnotator).toHaveBeenCalledWith(
      { _id: id },
      { session: session }
    );
    expect(spyAnnotation).toHaveBeenCalledWith({ annotator: id }, session);
  });

  it("delete Annotator and cascade to AnnotationService without session", async () => {
    const spyTransactionWrapper = jest
      .spyOn(TransactionWrapper, "transactionWrapper")
      .mockImplementation(async () => Promise.resolve());

    const id = "something";

    await AnnotatorService.deleteAnnotator(id);

    expect(spyTransactionWrapper).toHaveBeenCalled();
  });

  it("delete Annotators and cascade to AnnotationService with session", async () => {
    const spyAnnotator = jest
      .spyOn(Annotator, "deleteMany")
      .mockImplementation(async () => Promise.resolve());

    const spyAnnotatorFind = jest
      .spyOn(Annotator, "find")
      .mockImplementation(async () => Promise.resolve([1, 2]));

    const spyAnnotation = jest
      .spyOn(AnnotationService, "deleteAnnotations")
      .mockImplementation(async () => Promise.resolve());

    const filter = { role: "something" };
    const session = "session";
    await AnnotatorService.deleteAnnotators(filter, session);

    expect(spyAnnotatorFind).toHaveBeenCalledWith(filter, { session: session });
    expect(spyAnnotator).toHaveBeenCalledWith(filter, { session: session });
    expect(spyAnnotation).toHaveBeenCalledTimes(2);
  });

  it("delete Annotators and cascade to AnnotationService without session", async () => {
    const spyTransactionWrapper = jest
      .spyOn(TransactionWrapper, "transactionWrapper")
      .mockImplementation(async () => Promise.resolve());

    const filter = { role: "something" };

    await AnnotatorService.deleteAnnotators(filter);

    expect(spyTransactionWrapper).toHaveBeenCalled();
  });
});
