const express = require("express");
const router = express.Router();
const User = require("../user/model");
const { jwt, response } = require("../helpers");
async function register(req, res) {
  let { name, email, profilePicture } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    const apiResponse = response.createResponse({}, 409, false, false, {
      msg: `User with email ${email} already exists`
    });
    return res.json(apiResponse);
  }
  let newUser = await User.create({ name, email, profilePicture });
  let token = jwt.generateAuthenticationToken(newUser);
  const apiResponse = response.createResponse({ accessToken: token }, 201);
  return res.json(apiResponse);
}

async function login(req, res) {
  let { email } = req.body;
  let token;
  const userExists = await User.findOne({ email });
  token = jwt.generateAuthenticationToken(userExists);
  if (!userExists) {
    const apiResponse = response.createResponse({}, 401, false, false, {
      msg: `No user found with email ${email}`
    });
    return res.json(apiResponse);
  }
  const apiResponse = response.createResponse({ accessToken: token }, 200);
  return res.json(apiResponse);
}

router.post("/register", register);
router.post("/login", login);

module.exports = router;
