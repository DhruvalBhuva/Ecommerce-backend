const User = require("../../modals/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../../modals/user");
const shortid = require("shortid");

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await user.findOne({ email });

    console.log(existingUser);
    if (!existingUser || existingUser.role != "admin")
      return res.status(404).json({ message: "Admin does not exists" });

    const isPasswordCorrect = await bcrypt.compareSync(
      password,
      existingUser.hash_password
    );

    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Invalid Password..!" });

    // Creating token
    const token = jwt.sign(
      { role: existingUser.role, id: existingUser._id },
      process.env.JWT_SECRET, //= secret string for developr only
      { expiresIn: "1d" }
    );

    // Creating Cookie
    res.cookie("token", token, { expiresIn: "1h" });

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
        message: "Admin Exists..!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12); //12 is difficulty level

    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password: hashedPassword,
      userName: shortid.generate(),
      role: "admin",
    });

    _user.save((error, data) => {
      console.log(_user);
      if (error) {
        console.error(error);
        return res.status(400).json({
          message: " Something went wromg",
        });
      }

      if (data) {
        return res.status(201).json({
          message: "Admin Created successfuly..!!",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..!" });
  }
};

exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout Successfully..!",
  });
};
