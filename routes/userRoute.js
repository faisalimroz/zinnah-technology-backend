const express = require("express");
const { login, signup, userStatus } = require("../controllers/userController");

const router = express.Router();

router.post('/login',login)
router.post('/register',signup)
router.get('/user-status',userStatus)

module.exports = router;