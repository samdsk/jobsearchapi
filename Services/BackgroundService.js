const AnnotatorService = require("./AnnotatorService");
const Background = require("../Models/Background");
const TransactionWrapper = require("../db/TransactionWrapper");

const create = async (background) => {
  return await Background.Background.create(background);
};

const deleteBackground = async (id, session) => {
  if (session) {
    return await deleteOperation(id, session);
  } else {
    return await TransactionWrapper.transactionWrapper(id, deleteOperation);
  }
};

const deleteOperation = async (id, session) => {
  const background = await Background.Background.deleteOne(
    { _id: id },
    { session: session }
  );
  const annotators = await AnnotatorService.deleteAnnotators(
    { background: id },
    session
  );
  return { background: background, annotators };
};

const getAll = async () => {
  return await Background.Background.find();
};

const getBackground = async (id) => {
  const res = await Background.Background.findById(id);
  return res.background;
};

module.exports = { create, deleteBackground, getAll, getBackground };
