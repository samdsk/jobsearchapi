const { Collection } = require("../Models/Collection");
const TransactionWrapper = require("../db/TransactionWrapper");
const TextService = require("./TextService");

const opts = { runValidators: true };

const create = async (collection) => {
  return await Collection.create(collection);
};

const addText = async (id, text) => {
  return Collection.updateOne({ _id: id }, { $push: { texts: text } }, opts);
};
const removeText = async (id, text) => {
  return Collection.updateOne({ _id: id }, { $pull: { texts: text } }, opts);
};

const getName = async (id) => {
  const res = await Collection.findById(id);
  return res?.collection_name || null;
};

const getTexts = async (id) => {
  const res = await Collection.findById(id);
  return res?.texts || [];
};

const deleteCollection = async (id, session) => {
  if (session) {
    return await deleteOperation(id, session);
  } else {
    await TransactionWrapper.transactionWrapper(id, deleteOperation);
  }
};

const deleteOperation = async (id, session) => {
  const collection = await Collection.findById(id);
  const res = null;
  if (collection.texts) {
    const texts = collection.texts;

    res.texts = [];
    for (const text of texts) {
      const text_res = await TextService.deleteOne(text, session);
      res.texts.push(text_res);
    }
  }
  res.collection = await Collection.deleteOne({ _id: id });
  return res;
};

module.exports = {
  create,
  addText,
  removeText,
  getName,
  getTexts,
  deleteCollection,
};
