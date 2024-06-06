var express = require("express");
var router = express.Router();
let adminController = require("../controller/adminSign")

router.get("/Sign",adminController.adminSign);

module.exports = router;