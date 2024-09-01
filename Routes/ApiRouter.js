const express = require("express");
const router = express.Router();

const gateway = require("../API/apiGateway");

router.use("/", gateway);

module.exports = router;