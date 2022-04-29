const User = require("../model/User");

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
  const user = new User({
    name,
    email,
    password,
  });

  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }

  return res.status(201).json({ message: user });
};

exports.signup = signup;
