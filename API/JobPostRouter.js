const express = require("express");
const {
  searchJobPosts,
  getJobPost,
} = require("../Controllers/JobPostController");
const router = express.Router();

router.get("/search", searchJobPosts);
router.get("/get", getJobPost);

module.exports = router;
