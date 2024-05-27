const Annotation = require("../schemas/Annotation");
const Annotator = require("../schemas/Annotator");

async function cascadeDeleteAnnotations(filter) {
  await Annotation.Annotation.deleteMany(filter);
}

async function cascadeDeleteAnnotators(filter) {
  const annotators = await Annotator.Annotator.find(filter);

  for (const annotator of annotators)
    await cascadeDeleteAnnotations({ annotator: annotator._id });

  await Annotator.Annotator.deleteMany(filter);
}

module.exports.cascadeDeleteAnnotations = cascadeDeleteAnnotations;
module.exports.cascadeDeleteAnnotators = cascadeDeleteAnnotators;
