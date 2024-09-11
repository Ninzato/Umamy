const Controller = require("../controllers/Controller");

const router = require("express").Router();

router.get("/", Controller.home);

module.exports = router;
