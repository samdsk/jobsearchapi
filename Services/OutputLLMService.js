const OutputLLM = require("../Models/OutputLLM");

const getAll = async () => {
  return await OutputLLM.find();
};

module.exports = { getAll };
