const express = require("express");
const router = express.Router();
const ctrlMain = require("../controllers/main");

router.get("/", ctrlMain.home);
router.get("/profile", ctrlMain.profile);
router.get("/courses", ctrlMain.courses);
router.get("/courses/search", ctrlMain.search);

module.exports = router;