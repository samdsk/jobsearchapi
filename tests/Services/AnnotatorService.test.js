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

  it("get all annotators", async () => {
    const spy = jest
      .spyOn(Annotator, "find")
      .mockImplementation(() => Promise.resolve([1, 2, 3]));

    const res = await AnnotatorService.getAll();

    expect(res.length).toBe(3);

    expect(spy).toHaveBeenCalled();
  });
  it("get all annotators by role", async () => {
    const spy = jest
      .spyOn(Annotator, "find")
      .mockImplementation(() => Promise.resolve());

    const role = "role id";
    await AnnotatorService.getAnnotatorsByRole(role);

    expect(spy).toHaveBeenCalledWith({ role: role });
  });
  it("get all annotators by background", async () => {
    const spy = jest
      .spyOn(Annotator, "find")
      .mockImplementation(() => Promise.resolve());

    const background = "background id";
    await AnnotatorService.getAnnotatorsByBackground(background);

    expect(spy).toHaveBeenCalledWith({ background: background });
  });
  it("get all annotator by email", async () => {
    const spy = jest
      .spyOn(Annotator, "findOne")
      .mockImplementation(() => Promise.resolve());

    const email = "email";
    await AnnotatorService.getAnnotatorByEmail(email);

    expect(spy).toHaveBeenCalledWith({ email: email });
  });

  it("get background", async () => {
    const background = "background";
    const spy = jest
      .spyOn(Annotator, "findById")
      .mockImplementation(async () =>
        Promise.resolve({ background: background })
      );

    const id = "annotator id";
    const res = await AnnotatorService.getBackground(id);

    expect(spy).toHaveBeenCalledWith(id);
    expect(res).toEqual(background);
  });
  it("get email", async () => {
    const email = "email";
    const spy = jest
      .spyOn(Annotator, "findById")
      .mockImplementation(async () => Promise.resolve({ email: email }));

    const id = "annotator id";
    const res = await AnnotatorService.getEmail(id);

    expect(spy).toHaveBeenCalledWith(id);
    expect(res).toEqual(email);
  });
  it("get role", async () => {
    const role = "role";
    const spy = jest
      .spyOn(Annotator, "findById")
      .mockImplementation(async () => Promise.resolve({ role: role }));

    const id = "annotator id";
    const res = await AnnotatorService.getRole(id);

    expect(spy).toHaveBeenCalledWith(id);
    expect(res).toEqual(role);
  });
});