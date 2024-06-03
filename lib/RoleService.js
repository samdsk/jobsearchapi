const AnnotatorService = require("./AnnotatorService");
const Role = require("../schemas/Role");
const TransactionWrapper = require("./TransactionWrapper");

const create = async (role) => {
  return await Role.Role.create(role);
};

const updateReliabilityScore = async (id, score) => {
  return await Role.Role.updateOne({ _id: id }, { reliability_score: score });
};

const deleteRole = async (id, session) => {
  if (session) {
    return await deleteOperation(id, session);
  } else {
    return await TransactionWrapper.transactionWrapper(id, deleteOperation);
  }
};

const deleteOperation = async (id, session) => {
  const role = await Role.Role.deleteOne({ _id: id }, { session: session });
  const annotators = await AnnotatorService.deleteAnnotators(
    { role: id },
    session
  );
  return { role, annotators };
};

module.exports = { create, updateReliabilityScore, deleteRole };
