const express = require("express");
const router = express.Router();

const Auth = require("../controllers/auth");

//POST / login / user
router.post("/login", Auth.login);

//POST / register / user
router.post("/register", Auth.register);

//POST / refresh toke / user
router.post("/refresh-token", Auth.refreshToken);

module.exports = router;