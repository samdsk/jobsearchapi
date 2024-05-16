const Inclusiveness = require("../schema/Inclusiveness");
const JobPost = require("../schema/JobPost");

/**
 * @param {Inclusiveness} inclusiveness requires a valid inclusiveness object
 * @returns inserted inclusiveness record
 * @throws an Error if job_post_id is not defined or invalid
 * @throws an Error if already exists an inclusiveness relative to the given job_post_id
 */
async function createInclusiveness(inclusiveness) {
  if (!inclusiveness.job_post_id) throw new Error("job_post_id is required!");

  const job_post = await JobPost.exists({ _id: inclusiveness.job_post_id });
  if (!job_post) throw new Error("Invalid job_post_id!");

  return await Inclusiveness.create(inclusiveness);
}

async function getAllInclusiveness() {
  return await Inclusiveness.find({});
}

async function findInclusivenessByJobPostID(id) {
  return await Inclusiveness.findOne({ job_post_id: id });
}

async function deleteInclusivenessById(id) {
  return await Inclusiveness.deleteOne({ _id: id });
}
async function deleteInclusivenessByJobPostId(id) {
  return await Inclusiveness.deleteOne({ job_post_id: id });
}

/**
 * Updates the inclusiveness relative to job_post_id
 * @param {job_post_id} id requires a valid job_post_id
 * @param {*} update fields to update
 * @returns updated document
 */
async function updateInclusivenessByJobPostID(id, update) {
  return await Inclusiveness.updateOne({ job_post_id: id }, update);
}

module.exports = {
  createInclusiveness,
  deleteInclusivenessById,
  deleteInclusivenessByJobPostId,
  findInclusivenessByJobPostID,
  getAllInclusiveness,
  updateInclusivenessByJobPostID,
};
