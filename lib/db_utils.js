const Annotation = require("../schema/Annotation");
const Annotator = require("../schema/Annotator");
const Token = require("../schema/Token");

async function cascadeDeleteAnnotations(filter) {
  const annotations = await Annotation.Annotation.find(filter);

  for (const annotation of annotations)
    await Token.Token.deleteMany({ annotation: annotation._id });

  await Annotation.Annotation.deleteMany(filter);
}

async function cascadeDeleteAnnotators(filter) {
  const annotators = await Annotator.Annotator.find(filter);

  for (const annotator of annotators)
    await cascadeDeleteAnnotations({ annotator: annotator._id });

  await Annotator.Annotator.deleteMany(filter);
}

module.exports = { cascadeDeleteAnnotations, cascadeDeleteAnnotators };
