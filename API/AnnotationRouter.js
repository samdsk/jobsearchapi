const express = require("express");
const {
  searchAnnotation,
  getAnnotation,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
} = require("../Controllers/AnnotationController");
const router = express.Router();

router.get("/search", searchAnnotation);
router.get("/get", getAnnotation);
router.post("/", createAnnotation);
router.put("/", updateAnnotation);
router.delete("/", deleteAnnotation);

module.exports = router;
