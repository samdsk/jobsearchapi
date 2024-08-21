const Text = require("../Models/Text");
const { searchMultiple, searchSingle } = require("./CommonControllerMethods");

const searchText = async (req, res, next) => {
  try {
    const result = await searchMultiple(req, Text.Text);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const getText = async (req, res, next) => {
  try {
    const result = await searchSingle(req, Text.Text);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchText,
  getText,
};
