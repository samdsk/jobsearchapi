const { Annotation } = require("../../schemas/Annotation");

const deleteAnnotations = async (filter) => {
  return await Annotation.deleteMany(filter);
};

module.exports = { deleteAnnotations };
