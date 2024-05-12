const Inclusiveness = require("../schema/Inclusiveness");
const JobPost = require("../schema/JobPost");

/**
 * @param {Inclusiveness} inclusiveness requires a valid inclusiveness object
 * @returns inserted inclusiveness record
 * @throws an Error if job_post_id is not defined or invalid
 * @throws an Error if already exists an inclusiveness relative to the given job_post_id
 */
async function insertInclusiveness(inclusiveness) {
  if (!inclusiveness.job_post_id) throw new Error("job_post_id is required!");
  if (typeof inclusiveness.job_post_id !== "string")
    throw new Error("Invalid job_post_id!");

  const job_post = await JobPost.exists({ _id: inclusiveness.job_post_id });
  if (!job_post) throw new Error("Invalid job_post_id!");

  const found = await Inclusiveness.exists({
    job_post_id: inclusiveness.job_post_id,
  });

  if (found)
    throw new Error(
      "Already exists an inclusiveness record for this job post!"
    );

  const res = await Inclusiveness.create(inclusiveness);

  return res;
}

async function getAllInclusiveness() {
  return await Inclusiveness.find({});
}

async function findInclusiveness(query) {
  return await Inclusiveness.findOne(query);
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
  insertInclusiveness,
  deleteInclusivenessById,
  deleteInclusivenessByJobPostId,
  findInclusiveness,
  getAllInclusiveness,
  updateInclusivenessByJobPostID,
};
