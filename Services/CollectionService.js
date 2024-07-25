const { Collection } = require("../Models/Collection");
const TransactionWrapper = require("../db/TransactionWrapper");

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

module.exports = {
  create,
  addText,
  removeText,
  getName,
  getTexts,
};
