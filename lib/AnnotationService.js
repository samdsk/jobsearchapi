const { Annotation } = require("../schemas/Annotation");
const { JobPost } = require("../schemas/JobPost");

async function createAnnotation(annotation) {
  if (!annotation.job_post) throw new Error("job_post_id is required!");

  const job_post = await JobPost.exists({ _id: annotation.job_post });
  if (!job_post) throw new Error("Invalid job_post_id!");

  return await Annotation.create(annotation);
}

async function findAnnotationById(id) {
  return await Annotation.findById(id);
}
async function findAnnotationByJobPostID(job_post_id) {
  return await Annotation.find({ job_post_id: job_post_id });
}

async function deleteAnnotationsByJobPostID(id) {
  return await Annotation.deleteMany({ job_post: id });
}
async function deleteAnnotationByID(id) {
  return await Annotation.deleteOne({ _id: id });
}

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
