const DomainService = require("../../lib/Services/DomainService");
const AnnotationService = require("../../lib/Services/AnnotationService");
const TransactionWrapper = require("../../lib/TransactionWrapper");
const { Domain } = require("../../schemas/Domain");

describe("Domain Service", () => {
  beforeEach(() => jest.restoreAllMocks());

  it("create a domain", async () => {
    const spyLabel = jest
      .spyOn(Domain, "create")
      .mockImplementation(async () => Promise.resolve());

    const domain = {};
    await DomainService.create(domain);

    expect(spyLabel).toHaveBeenCalled();
  });

  it("delete Domain cascades deletes to Annotations with session", async () => {
    const spyLabel = jest
      .spyOn(Domain, "deleteOne")
      .mockImplementation(async () => Promise.resolve());

    const spyAnnotation = jest
      .spyOn(AnnotationService, "deleteAnnotations")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const session = "session";
    await DomainService.deleteDomain(id, session);

    expect(spyLabel).toHaveBeenCalledWith({ _id: id }, { session: session });
    expect(spyAnnotation).toHaveBeenCalledWith({ domain: id }, session);
  });

  it("delete Domain cascades deletes to Annotations without session", async () => {
    const spyTransactionWrapper = jest
      .spyOn(TransactionWrapper, "transactionWrapper")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    await DomainService.deleteDomain(id);

    expect(spyTransactionWrapper).toHaveBeenCalled();
  });
});
