const AnnotatorService = require("./AnnotatorService");
const Role = require("../Models/Role");
const TransactionWrapper = require("../db/TransactionWrapper");

const opts = { runValidators: true };

const create = async (role) => {
  return await Role.Role.create(role);
};

const updateReliabilityScore = async (id, score) => {
  return await Role.Role.updateOne(
    { _id: id },
    { reliability_score: score },
    opts
  );
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
  return { role: role, annotators };
};

const getAll = async () => {
  return await Role.Role.find();
};
const getRolesByReliabilityScore = async (score) => {
  return await Role.Role.find({ reliability_score: score });
};
const getRole = async (id) => {
  const res = await Role.Role.findById(id);
  return res?.role || null;
};
const getReliabilityScore = async (id) => {
  const res = await Role.Role.findById(id);
  return res?.reliability_score || null;
};

module.exports = {
  create,
  updateReliabilityScore,
  deleteRole,
  getAll,
  getRolesByReliabilityScore,
  getRole,
  getReliabilityScore,
};
