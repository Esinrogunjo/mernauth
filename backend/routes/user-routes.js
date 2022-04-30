const express = require("express");
const {
  signup,
  login,
  verifyToken,
  getUser,
  refreshToken,
} = require("../controllers/user-controller");

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
//verify token for refresh token

router.get("/refresh", refreshToken, verifyToken);

module.exports = router;
