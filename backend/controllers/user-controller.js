const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { json } = require("express");
const JWT_SECET_KEY = "myseckey123";

//stroing cookie in the http only is very secure using cookie-paser
const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    console.log(error);
  }

  if (existingUser)
    return res
      .status(400)
      .json({ message: "user already exists, login instead" });
  const hashPassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    email,
    password: hashPassword,
  });

  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }

  return res.status(201).json({ message: user });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "user not found, please signup" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "invalid email or password" });
  }
  const token = jwt.sign({ id: existingUser._id }, JWT_SECET_KEY, {
    expiresIn: "35s",
  });

  console.log(`generated token = \n ${token}`);

  if (req.cookies[`${existingUser._id}`]) {
    req.cookies[`${existingUser._id}`] = "";
  }
  res.cookie(String(existingUser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 30),
    httpOnly: true,
    sameSite: "lax",
  });
  res.status(200).json({ message: "welcome back man", existingUser, token });
};

const verifyToken = (req, res, next) => {
  const cookie = req.headers.cookie;
  const token = cookie.split("=")[1];
  console.log(token);
  //These 2 commented lines were used to get the token before using cookie , now I am using the cookie to get the token
  //   const headers = req.headers[`authorization`];
  //   const token = headers.split(" ")[1];

  if (!token) {
    res.status(404).json({ message: "no token found" });
  }
  jwt.verify(String(token), JWT_SECET_KEY, (error, user) => {
    if (error) {
      return res.status(400).json({
        message: "token verification error",
        error,
      });
    }

    req.id = user.id;
  });
  next();
};

const getUser = async (req, res, next) => {
  const userId = req.id;
  let user;

  try {
    user = await User.findById(userId, "-password");
  } catch (error) {
    return new Error(error);
  }
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  return res.status(200).json({ message: user });
};

const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies.split("=")[1];
  if (!prevToken) {
    return res.status(400), json({ message: "Could not verify token " });
  }

  jwt.verify(String(prevToken), JWT_SECET_KEY, (error, user) => {
    if (error) {
      console.log(error);
      return res.status(403).json({ message: "Authentication failed", error });
    }

    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";

    const token = jwt.sign({ id: user.id }, JWT_SECET_KEY, {
      expiresIn: "35s",
    });

    console.log(`Regenrated  token here = \n ${token}`);

    res.cookie(String(user._id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30),
      httpOnly: true,
      sameSite: "lax",
    });

    req.id = user.id;
    next();
  });
};

exports.signup = signup;

exports.login = login;

exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
