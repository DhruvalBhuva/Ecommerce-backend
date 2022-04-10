const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hash_password: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    contactNumber: { type: String },
    profilePicture: { type: String },
  },
  { timestamps: true }
);


// To concate name for fullname
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

//Below method return true/False by comparing ==can call to verify as user.authenticate(password)
// userSchema.methods = {
//   authenticate: function (password) {
//     return bcrypt.compareSync(password, this.hase_password);
//   },
// };

module.exports = mongoose.model("User", userSchema);
