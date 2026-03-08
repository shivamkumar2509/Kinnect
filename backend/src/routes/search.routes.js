const router = require("express").Router();
const { search } = require("../controllers/search.controller");

router.get("/users", search);

module.exports = router;
