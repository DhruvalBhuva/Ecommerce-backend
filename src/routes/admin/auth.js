const express = require("express");
const { signUp, signIn, signOut } = require("../../controlles/admin/auth");
const { requireSignIn } = require("../../commen-middleware/index");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../../validators/auth");

const router = express.Router();

router.post("/signin", validateSigninRequest, isRequestValidated, signIn);
router.post("/signup", validateSignupRequest, isRequestValidated, signUp);
router.post("/signout", signOut);

// router.post("/profile", requireSignIn, (req, res) => { // Onces reuireSignIn is executed controll goes in ahead
//   res.status(200).json({
//     user: "Profile",
//   });
// });
module.exports = router;
