const RoleService = require("../../lib/Services/RoleService");
const AnnotatorService = require("../../lib/Services/AnnotatorService");
const TransactionWrapper = require("../../lib/TransactionWrapper");
const { Role } = require("../../schemas/Role");

describe("Role Service", () => {
  beforeEach(() => jest.restoreAllMocks());

  it("create a role", async () => {
    const spyRole = jest
      .spyOn(Role, "create")
      .mockImplementation(async () => Promise.resolve());

    const role = {};
    await RoleService.create(role);

    expect(spyRole).toHaveBeenCalled();
  });

  it("update Reliability score", async () => {
    const spyRole = jest
      .spyOn(Role, "updateOne")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const score = 56;

    await RoleService.updateReliabilityScore(id, score);

    expect(spyRole).toHaveBeenCalled();
    expect(spyRole).toHaveBeenCalledWith(
      { _id: id },
      { reliability_score: score }
    );
  });

  it("delete Role cascades deletes to Annotators with session", async () => {
    const spyRole = jest
      .spyOn(Role, "deleteOne")
      .mockImplementation(async () => Promise.resolve());

    const spyAnnotator = jest
      .spyOn(AnnotatorService, "deleteAnnotators")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    const session = "session";
    await RoleService.deleteRole(id, session);

    expect(spyRole).toHaveBeenCalledWith({ _id: id }, { session: session });
    expect(spyAnnotator).toHaveBeenCalledWith({ role: id }, session);
  });

  it("delete Role cascades deletes to Annotators without session", async () => {
    const spyTransactionWrapper = jest
      .spyOn(TransactionWrapper, "transactionWrapper")
      .mockImplementation(async () => Promise.resolve());

    const id = "id";
    await RoleService.deleteRole(id);

    expect(spyTransactionWrapper).toHaveBeenCalled();
  });
});
