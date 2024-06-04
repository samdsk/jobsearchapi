const AnnotationService = require("../../lib/Services/AnnotationService");
const TransactionWrapper = require("../../lib/TransactionWrapper");
const { Annotation } = require("../../schemas/Annotation");

const { connect, close } = require("../db_handler");

const opts = { runValidators: true };

describe("Annotation Service", () => {
  beforeAll(async () => {
    await connect();
  });
  afterAll(async () => {
    await close();
  });
  beforeEach(() => jest.restoreAllMocks());
  it("creates annotation", async () => {
    const spy = jest
      .spyOn(Annotation, "create")
      .mockImplementation(async () => Promise.resolve());

    const annotator = {
      role: "role.id",
      email: "name@example.com",
      background: "background.id",
    };

    await AnnotationService.create(annotator);

    expect(spy).toHaveBeenCalled();
  });

  it("annotator update source", async () => {
    const spy = jest
      .spyOn(Annotation, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const source = "source";
    await AnnotationService.updateSource(id, source);

    expect(spy).toHaveBeenCalledWith({ _id: id }, { source: source }, opts);
  });
  it("annotator update annotator", async () => {
    const spy = jest
      .spyOn(Annotation, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const annotator = "annotator";
    await AnnotationService.updateAnnotator(id, annotator);

    expect(spy).toHaveBeenCalledWith(
      { _id: id },
      { annotator: annotator },
      opts
    );
  });
  it("annotator update label", async () => {
    const spy = jest
      .spyOn(Annotation, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const label = "label";
    await AnnotationService.updateLabel(id, label);

    expect(spy).toHaveBeenCalledWith({ _id: id }, { label: label }, opts);
  });
  it("annotator update reason", async () => {
    const spy = jest
      .spyOn(Annotation, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const reason = "reason";
    await AnnotationService.updateReason(id, reason);

    expect(spy).toHaveBeenCalledWith({ _id: id }, { reason: reason }, opts);
  });
  it("annotator update domain", async () => {
    const spy = jest
      .spyOn(Annotation, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const domain = "domain";
    await AnnotationService.updateDomain(id, domain);

    expect(spy).toHaveBeenCalledWith({ _id: id }, { domain: domain }, opts);
  });
  it("annotator add token", async () => {
    const spy = jest
      .spyOn(Annotation, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const token = "token";
    await AnnotationService.addToken(id, token);

    expect(spy).toHaveBeenCalledWith(
      { _id: id },
      { $push: { tokens: token } },
      opts
    );
  });
  it("annotator remove token", async () => {
    const spy = jest
      .spyOn(Annotation, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const token = "token";
    await AnnotationService.removeToken(id, token);

    expect(spy).toHaveBeenCalledWith(
      { _id: id },
      { $pull: { tokens: token } },
      opts
    );
  });
  it("annotator update tokens", async () => {
    const spy = jest
      .spyOn(Annotation, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const tokens = "tokens";
    await AnnotationService.updateTokens(id, tokens);

    expect(spy).toHaveBeenCalledWith({ _id: id }, { tokens: tokens }, opts);
  });

  it("delete an Annotation with session", async () => {
    const spy = jest
      .spyOn(Annotation, "deleteOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const session = "session";

    await AnnotationService.deleteAnnotation(id, session);

    expect(spy).toHaveBeenCalledWith({ _id: id }, { session: session });
  });
  it("delete an Annotation without session", async () => {
    const spy = jest
      .spyOn(TransactionWrapper, "transactionWrapper")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";

    await AnnotationService.deleteAnnotation(id);

    expect(spy).toHaveBeenCalled();
  });

  it("delete an Annotations with session", async () => {
    const spy = jest
      .spyOn(Annotation, "deleteMany")
      .mockImplementation(async () => Promise.resolve());

    const filter = {};
    const session = "session";

    await AnnotationService.deleteAnnotations(filter, session);

    expect(spy).toHaveBeenCalledWith(filter, { session: session });
  });
  it("delete an Annotation without session", async () => {
    const spy = jest
      .spyOn(TransactionWrapper, "transactionWrapper")
      .mockImplementation(async () => Promise.resolve());

    const filter = {};

    await AnnotationService.deleteAnnotations(filter);

    expect(spy).toHaveBeenCalled();
  });
});
