const AnnotationService = require("./AnnotationService");
const { JobPost } = require("../Models/JobPost");
const TransactionWrapper = require("../db/TransactionWrapper");
const IdGenerator = require("../lib/IdGenerator");
const DataProviderService = require("../Services/DataProviderService");

const opts = { runValidators: true };

/**
 * Creates a JobPost
 * @param {JobPost} job_post must respect the JobPost schema
 * @returns inserted JobPost and if it already exists returns null
 */
const create = async (job_post) => {
  const id = IdGenerator.generateJobPostID(job_post);

  const found = await JobPost.findById(id);
  if (found) return null;

  job_post._id = id;

  const data_provider_id = await DataProviderService.getIDByName(
    job_post.data_provider
  );

  if (!data_provider_id)
    throw new Error(`Data Provider ${job_post.data_provider} not found 404!`);

  job_post.data_provider = data_provider_id;

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

const updateText = async (id, text) => {
  return await JobPost.updateOne({ _id: id }, { text: text }, opts);
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

const getAll = async () => {
  return await JobPost.find();
};

const getJobPostsByJobType = async (job_type) => {
  return await JobPost.find({ job_type: job_type });
};
const getJobPostsByTitle = async (title) => {
  return await JobPost.find({ title: title });
};
const getJobPostsByCompany = async (company) => {
  return await JobPost.find({ company: company });
};
const getJobPostsByLocation = async (location) => {
  return await JobPost.find({ location: location });
};
const getJobPostsByEmploymentType = async (employment_type) => {
  return await JobPost.find({ employment_type: employment_type });
};

const getJobType = async (id) => {
  const res = await JobPost.findById(id);
  return res.job_type;
};
const getTitle = async (id) => {
  const res = await JobPost.findById(id);
  return res.title;
};
const getCompany = async (id) => {
  const res = await JobPost.findById(id);
  return res.company;
};
const getLocation = async (id) => {
  const res = await JobPost.findById(id);
  return res.location;
};
const getEmploymentType = async (id) => {
  const res = await JobPost.findById(id);
  return res.employment_type;
};
const getText = async (id) => {
  const res = await JobPost.findById(id);
  return res.text;
};
const getLinks = async (id) => {
  const res = await JobPost.findById(id);
  return res.links;
};
const getLinkBySource = async (id, source) => {
  const links = await getLinks(id);
  for (const link of links) {
    if (link.source === source) return link.url;
  }
  return null;
};

const getAllTexts = async () => {
  const res = await getAll();
  return res.map((job) => job.text);
};

module.exports = {
  create,
  updateJobType,
  updateTitle,
  updateCompany,
  updateLocation,
  updateEmploymentType,
  updateText,
  updateLinks,
  addLink,
  removeLinkBySource,
  removeLinkByURL,
  deleteJobPost,
  getAll,
  getAllTexts,
  getJobPostsByJobType,
  getJobPostsByTitle,
  getJobPostsByCompany,
  getJobPostsByLocation,
  getJobPostsByEmploymentType,
  getJobType,
  getTitle,
  getCompany,
  getLocation,
  getEmploymentType,
  getText,
  getLinks,
  getLinkBySource,
};
