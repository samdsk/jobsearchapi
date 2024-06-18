const { Annotation } = require("../Models/Annotation");
const TransactionWrapper = require("../db/TransactionWrapper");

const opts = { runValidators: true };

const create = async (annotation) => {
  return await Annotation.create(annotation);
};

const updateSource = async (id, source) => {
  return await Annotation.updateOne({ _id: id }, { source: source }, opts);
};

const updateAnnotator = async (id, annotator) => {
  return await Annotation.updateOne(
    { _id: id },
    { annotator: annotator },
    opts
  );
};

const updateLabel = async (id, label) => {
  return Annotation.updateOne({ _id: id }, { label: label }, opts);
};

const updateReason = async (id, reason) => {
  return await Annotation.updateOne({ _id: id }, { reason: reason }, opts);
};

const updateDomain = async (id, domain) => {
  return await Annotation.updateOne({ _id: id }, { domain: domain }, opts);
};

const updateTokens = async (id, tokens) => {
  return await Annotation.updateOne({ _id: id }, { tokens: tokens }, opts);
};

const addToken = async (id, token) => {
  return await Annotation.updateOne(
    { _id: id },
    { $push: { tokens: token } },
    opts
  );
};
const removeToken = async (id, token) => {
  return await Annotation.updateOne(
    { _id: id },
    { $pull: { tokens: token } },
    opts
  );
};

const deleteAnnotations = async (filter, session) => {
  if (session) return await deleteAnnotationsWithSession(filter, session);
  else
    return TransactionWrapper.transactionWrapper(
      filter,
      deleteAnnotationsWithSession
    );
};

const deleteAnnotationsWithSession = async (filter, session) => {
  return await Annotation.deleteMany(filter, { session: session });
};

const deleteAnnotation = async (id, session) => {
  if (session) return await deleteAnnotationWithSession(id, session);
  else TransactionWrapper.transactionWrapper(id, deleteAnnotationWithSession);
};

const deleteAnnotationWithSession = async (id, session) => {
  return await Annotation.deleteOne({ _id: id }, { session: session });
};

const getAll = async () => {
  return await Annotation.find();
};

const getAnnotationsBySource = async (source) => {
  return await Annotation.find({ source: source });
};
const getAnnotationsByLabel = async (label) => {
  return await Annotation.find({ label: label });
};
const getAnnotationsByDomain = async (domain) => {
  return await Annotation.find({ domain: domain });
};
const getAnnotationsByAnnotator = async (annotator) => {
  return await Annotation.find({ annotator: annotator });
};

const getSource = async (id) => {
  const res = await Annotation.findById(id);
  return res.source;
};
const getAnnotator = async (id) => {
  const res = await Annotation.findById(id);
  return res.annotator;
};
const getLabel = async (id) => {
  const res = await Annotation.findById(id);
  return res.label;
};
const getReason = async (id) => {
  const res = await Annotation.findById(id);
  return res.reason;
};
const getDomain = async (id) => {
  const res = await Annotation.findById(id);
  return res.domain;
};
const getTokens = async (id) => {
  const res = await Annotation.findById(id);
  return res.tokens;
};

module.exports = {
  create,
  updateSource,
  updateAnnotator,
  updateLabel,
  updateReason,
  updateDomain,
  updateTokens,
  addToken,
  removeToken,
  deleteAnnotations,
  deleteAnnotation,
  getAll,
  getAnnotationsByAnnotator,
  getAnnotationsByDomain,
  getAnnotationsByLabel,
  getAnnotationsBySource,
  getSource,
  getTokens,
  getDomain,
  getReason,
  getLabel,
  getAnnotator,
};
