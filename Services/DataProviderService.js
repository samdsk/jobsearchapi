const { DataProvider } = require("../Models/DataProvider");

const getIDByName = async (data_provider) => {
  const res = await DataProvider.findOne({
    data_provider: data_provider.toLowerCase(),
  }).select("_id");

  if (res?._id) return res._id;
  return null;
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

module.exports = {
  getIDByName,
  create,
};
