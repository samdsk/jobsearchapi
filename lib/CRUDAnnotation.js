const Annotation = require("../schema/Annotation");
const JobPost = require("../schema/JobPost");

async function isDuplicate(annotation) {
  const found = await Annotation.findOne({
    job_post_id: annotation.job_post_id,
    type: annotation.type,
    index_start: annotation.index_start,
    index_end: annotation.index_end,
  });

  return found ? true : false;
}

async function createAnnotation(annotation) {
  if (!annotation.job_post_id) throw new Error("job_post_id is required!");

  const job_post = await JobPost.exists({ _id: annotation.job_post_id });
  if (!job_post) throw new Error("Invalid job_post_id!");

  if (await isDuplicate(annotation)) throw new Error("Duplicate detected!");

  return await Annotation.create(annotation);
}

async function findAnnotationById(id) {
  return await Annotation.findById(id);
}
async function findAnnotationByJobPostID(job_post_id) {
  return await Annotation.find({ job_post_id: job_post_id });
}

async function deleteAnnotationsByJobPostID(id) {
  return await Annotation.deleteMany({ job_post_id: id });
}
async function deleteAnnotationByID(id) {
  return await Annotation.deleteOne({ _id: id });
}

// TODO: add duplicate detection
async function updateAnnotationByID(id, update) {
  return await Annotation.updateOne({ _id: id }, update);
}

async function getAllAnnotations() {
  return await Annotation.find({});
}

module.exports = {
  createAnnotation,
  findAnnotationById,
  findAnnotationByJobPostID,
  deleteAnnotationsByJobPostID,
  deleteAnnotationByID,
  updateAnnotationByID,
  getAllAnnotations,
};
