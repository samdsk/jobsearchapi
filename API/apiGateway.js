const express = require("express");
const OutputLLMRouter = require("./OutputLLMRouter");
const JobPostRouter = require("./JobPostRouter");
const TextRouter = require("./TextRouter");
const DataProviderRouter = require("./DataProviderRouter");
const LabelRouter = require("./LabelRouter");
const DomainRouter = require("./DomainRouter");
const BackgroundRouter = require("./BackgroundRouter");
const RoleRouter = require("./RoleRouter");
const AnnotatorRouter = require("./AnnotatorRouter");
const AnnotationRouter = require("./AnnotationRouter");
const CollectionRouter = require("./CollectionRouter");

const router = express.Router();

router.use("/OutputLLM", OutputLLMRouter);
router.use("/JobPost", JobPostRouter);
router.use("/Text", TextRouter);
router.use("/DataProvider", DataProviderRouter);
router.use("/Label", LabelRouter);
router.use("/Domain", DomainRouter);
router.use("/Background", BackgroundRouter);
router.use("/Role", RoleRouter);
router.use("/Annotator", AnnotatorRouter);
router.use("/Annotation", AnnotationRouter);
router.use("/Collection", CollectionRouter);

module.exports = router;
