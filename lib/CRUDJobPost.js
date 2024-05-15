const JobPost = require("../schema/JobPost");
const Inclusiveness = require("../schema/Inclusiveness");
const generateId = require("./generateID");
const Annotation = require("../schema/Annotation");

/**
 * Creates a JobPost
 * @param {JobPost} job_post must respect the JobPost schema
 * @returns inserted JobPost and if it already exists returns null
 */
async function createJobPost(job_post) {
  const id = generateId.generateID(job_post);
  job_post._id = id;

  return await JobPost.create(job_post);
}

async function deleteJobPost(id) {
  await Inclusiveness.deleteOne({ job_post_id: id });
  await Annotation.deleteMany({ job_post_id: id });
  return await JobPost.deleteOne({ _id: id });
}

async function findJobPostById(id) {
  return await JobPost.findById(id);
}

async function getAllJobPosts() {
  return await JobPost.find({});
}

async function findJobPost(query) {
  return await JobPost.findOne(query);
}

async function updateJobPostOne(query, update) {
  return await JobPost.updateOne(query, update);
}
async function updateJobPostMany(query, update) {
  return await JobPost.updateMany(query, update);
}

module.exports = {
  createJobPost,
  findJobPostById,
  findJobPost,
  deleteJobPost,
  getAllJobPosts,
  updateJobPostOne,
  updateJobPostMany,
};
