const OutputLLM = require("../Schemas/OutputLLM");

const getAll = async () => {
  return await OutputLLM.find();
};

module.exports = { getAll };
