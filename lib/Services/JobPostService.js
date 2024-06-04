const AnnotationService = require("./AnnotationService");
const { JobPost } = require("../../schemas/JobPost");
const TransactionWrapper = require("../TransactionWrapper");
const generateId = require("../generateID");

const opts = { runValidators: true };

/**
 * Creates a JobPost
 * @param {JobPost} job_post must respect the JobPost schema
 * @returns inserted JobPost and if it already exists returns null
 */
const create = async (job_post) => {
  const id = generateId.generateID(job_post);
  job_post._id = id;

  return await JobPost.create(job_post);
};

const updateJobType = async (id, job_type) => {
  return await JobPost.updateOne({ _id: id }, { job_type: job_type }, opts);
};

const updateTitle = async (id, title) => {
  return await JobPost.updateOne({ _id: id }, { title: title }, opts);
};

const updateCompany = async (id, company) => {
  return await JobPost.updateOne({ _id: id }, { company: company }, opts);
};

const updateLocation = async (id, location) => {
  return await JobPost.updateOne({ _id: id }, { location: location }, opts);
};

const updateEmploymentType = async (id, employment_type) => {
  return await JobPost.updateOne(
    { _id: id },
    { employment_type: employment_type },
    opts
  );
};

const updateDescription = async (id, description) => {
  return await JobPost.updateOne(
    { _id: id },
    { description: description },
    opts
  );
};

const updateLinks = async (id, links) => {
  return await JobPost.updateOne({ _id: id }, { links: links }, opts);
};

const addLink = async (id, link) => {
  return await JobPost.updateOne({ _id: id }, { $push: { links: link } }, opts);
};

const removeLinkBySource = async (id, link_source) => {
  return await JobPost.updateOne(
    { _id: id },
    { $pull: { links: { source: link_source } } },
    opts
  );
};

const removeLinkByURL = async (id, link_url) => {
  return await JobPost.updateOne(
    { _id: id },
    { $pull: { links: { url: link_url } } },
    opts
  );
};

const deleteJobPost = async (id, session) => {
  if (session) return await deleteJobPostWithSession(id, session);
  else
    return await TransactionWrapper.transactionWrapper(
      id,
      deleteJobPostWithSession
    );
};

const deleteJobPostWithSession = async (id, session) => {
  const res = {};

  res.job_post = await JobPost.deleteOne({ _id: id }, { session: session });
  res.annotations = await AnnotationService.deleteAnnotations(
    { job_post: id },
    session
  );

  return res;
};

module.exports = {
  create,
  updateJobType,
  updateTitle,
  updateCompany,
  updateLocation,
  updateEmploymentType,
  updateDescription,
  updateLinks,
  addLink,
  removeLinkBySource,
  removeLinkByURL,
  deleteJobPost,
};
