const User = require("../model/User");
const bcrypt = require("bcryptjs");

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
  res.status(200).json({ message: "welcome back man", existingUser });
};

exports.signup = signup;

exports.login = login;
