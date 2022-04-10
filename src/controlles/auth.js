const User = require("../modals/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../modals/user");
const { validationResult } = require("express-validator");
const shortid = require("shortid");


exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await user.findOne({ email });

    console.log(existingUser);
    if (existingUser.role != "user" || !existingUser)
      return res.status(404).json({ message: "User does't exist" });

    const isPasswordCorrect = await bcrypt.compareSync(
      password,
      existingUser.hash_password
    );

    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Invalid Password..!!" });

    const token = jwt.sign(
      { role: existingUser.role, _id: existingUser._id },
      process.env.JWT_SECRET, //= secret string for developr only
      { expiresIn: "1d" }
    );

    const { _id, firstName, lastName, role, fullName } = existingUser;
    res.status(200).json({
      token,
      user: {
        _id,
        firstName,
        lastName,
        email,
        role,
        fullName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(404).json({
        message: "User already registered..!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12); //12 is difficulty level
    console.log({ firstName, lastName, email, password, hashedPassword });

    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password: hashedPassword,
      userName: shortid.generate(),
      role: "user",
    });

    _user.save((error, data) => {
      if (error) {
        console.error(error);
        return res.status(400).json({
          message: " Something went wromg",
        });
      }

      if (data) {
        return res.status(201).json({
          message: "User Created success..!!",
        });
      }
    });
  } catch (error) {
    console.log({error});
    res.status(500).json({ message: error });
  }
};
