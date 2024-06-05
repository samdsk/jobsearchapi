const OutputLLM = require("../../schemas/OutputLLM");

const getAll = async () => {
  return await OutputLLM.find();
};

module.exports = { getAll };
