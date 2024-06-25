const { Annotator } = require("../Models/Annotator");
const AnnotationService = require("./AnnotationService");
const TransactionWrapper = require("../db/TransactionWrapper");

const opts = { runValidators: true };

const create = async (annotator) => {
  return await Annotator.create(annotator);
};

const updateRole = async (id, role) => {
  return await Annotator.updateOne({ _id: id }, { role: role }, opts);
};

const updateBackground = async (id, background) => {
  return await Annotator.updateOne(
    { _id: id },
    { background: background },
    opts
  );
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

const getAll = async () => {
  return await Annotator.find();
};
const getAnnotatorsByRole = async (role) => {
  return await Annotator.find({ role: role });
};
const getAnnotatorsByBackground = async (background) => {
  return await Annotator.find({ background: background });
};

const getRole = async (id) => {
  const res = await Annotator.findById(id);
  return res.role;
};

const getBackground = async (id) => {
  const res = await Annotator.findById(id);
  return res.background;
};

module.exports = {
  create,
  updateRole,
  updateBackground,
  deleteAnnotator,
  deleteAnnotators,
  getAll,
  getAnnotatorsByRole,
  getAnnotatorsByBackground,
  getRole,
  getBackground,
};
