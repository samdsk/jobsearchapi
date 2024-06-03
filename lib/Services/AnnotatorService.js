const { Annotator } = require("../../schemas/Annotator");

const AnnotationService = require("./AnnotationService");

const TransactionWrapper = require("../TransactionWrapper");

const create = async (annotator) => {
  return await Annotator.create(annotator);
};

const updateEmail = async (id, email) => {
  return await Annotator.updateOne({ _id: id }, { email: email });
};
const updateRole = async (id, role) => {
  return await Annotator.updateOne({ _id: id }, { role: role });
};
const updateBackground = async (id, background) => {
  return await Annotator.updateOne({ _id: id }, { background: background });
};

const deleteAnnotator = async (id, session) => {
  if (session) {
    return await deleteAnnotatorWithSession(id, session);
  } else {
    return await TransactionWrapper.transactionWrapper(
      id,
      deleteAnnotatorWithSession
    );
  }
};

const deleteAnnotators = async (filter, session) => {
  if (session) {
    return await deleteAnnotatorsWithSession(filter, session);
  } else {
    return await TransactionWrapper.transactionWrapper(
      filter,
      deleteAnnotatorsWithSession
    );
  }
};

const deleteAnnotatorsWithSession = async (filter, session) => {
  const annotators = await Annotator.find(filter, { session: session });
  const annotations = [];

  for (const annotator of annotators) {
    const res = {};

    res[annotator._id] = await AnnotationService.deleteAnnotations(
      { annotator: annotator._id },
      session
    );

    annotations.push(res);
  }

  const deletedAnnotators = { annotations: annotations };

  deleteAnnotators.annotators = await Annotator.deleteMany(filter, {
    session: session,
  });

  return deletedAnnotators;
};

const deleteAnnotatorWithSession = async (id, session) => {
  const annotator = await Annotator.deleteOne(
    { _id: id },
    { session: session }
  );
  const annotations = await AnnotationService.deleteAnnotations(
    { annotator: id },
    session
  );

  return { annotator: annotator, annotations: annotations };
};

module.exports = {
  create,
  updateEmail,
  updateRole,
  updateBackground,
  deleteAnnotator,
  deleteAnnotators,
};
