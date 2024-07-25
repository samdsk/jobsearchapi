const { DataProvider } = require("../Models/DataProvider");
const TextService = require("./TextService");
const TransactionWrapper = require("../db/TransactionWrapper");

const getIDByName = async (data_provider) => {
  const res = await DataProvider.findOne({
    data_provider: data_provider.toLowerCase(),
  }).select("_id");

  return res?._id || null;
};

const create = async (data_provider) => {
  if (typeof data_provider !== "string")
    throw new Error("data_provider must be a string!");
  const name = data_provider.toLowerCase();

  const found = await getIDByName(name);
  if (found) return null;

  const obj = {
    data_provider: name,
  };
  return await DataProvider.create(obj);
};

const getAll = async () => {
  return await DataProvider.find({});
};

const deleteDataProvider = async (id, session) => {
  if (session) {
    return await deleteOperation(id, session);
  } else {
    return await TransactionWrapper.transactionWrapper(id, deleteOperation);
  }
};

const deleteOperation = async (id, session) => {
  const domain = await DataProvider.deleteOne(
    { _id: id },
    { session: session }
  );
  const annotation = await TextService.deleteMany(
    { data_provider: id },
    session
  );
  return { domain: domain, annotation };
};

module.exports = {
  getIDByName,
  create,
  getAll,
  deleteDataProvider,
};
