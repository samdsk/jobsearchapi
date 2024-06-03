const AnnotatorService = require("./AnnotatorService");
const Background = require("../../schemas/Background");
const TransactionWrapper = require("../TransactionWrapper");

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
  return { background, annotators };
};

module.exports = { create, deleteBackground };
