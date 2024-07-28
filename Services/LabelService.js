const { Label } = require("../Models/Label");
const AnnotationService = require("./AnnotationService");
const TransactionWrapper = require("../db/TransactionWrapper");

const create = async (label) => {
  return await Label.create(label);
};

const deleteLabel = async (id, session) => {
  if (session) {
    return await deleteOperation(id, session);
  } else {
    return await TransactionWrapper.transactionWrapper(id, deleteOperation);
  }
};

const deleteOperation = async (id, session) => {
  const label = await Label.deleteOne({ _id: id }, { session: session });
  const annotation = await AnnotationService.deleteAnnotations(
    { label: id },
    session
  );
  return { label: label, annotation };
};

const getAll = async () => {
  return await Label.find();
};

const getLabel = async (id) => {
  const res = await Label.findById(id);
  return res?.label || null;
};

module.exports = { create, deleteLabel, getAll, getLabel };
