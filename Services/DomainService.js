const { Domain } = require("../Models/Domain");
const AnnotationService = require("./AnnotationService");
const TransactionWrapper = require("../db/TransactionWrapper");

const create = async (domain) => {
  return await Domain.create(domain);
};

const deleteDomain = async (id, session) => {
  if (session) {
    return await deleteOperation(id, session);
  } else {
    return await TransactionWrapper.transactionWrapper(id, deleteOperation);
  }
};

const deleteOperation = async (id, session) => {
  const domain = await Domain.deleteOne({ _id: id }, { session: session });
  const annotation = await AnnotationService.deleteAnnotations(
    { domain: id },
    session
  );
  return { domain: domain, annotation };
};

const getAll = async () => {
  return await Domain.find();
};

const getDomain = async (id) => {
  const res = await Domain.findById(id);
  return res?.domain || null;
};

module.exports = { create, deleteDomain, getAll, getDomain };
