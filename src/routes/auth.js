const express = require("express");
const { signUp, signIn } = require("../controlles/auth");
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require("../validators/auth");
const router = express.Router();

router.post("/signin",validateSigninRequest,isRequestValidated,signIn);

// After checking all the condition controll will go to the signup controller
router.post("/signup", validateSignupRequest,isRequestValidated ,signUp);

// router.post("/profile", requireSignIn, (req, res) => {
//   // Onces reuireSignIn is executed controll goes in ahead
//   res.status(200).json({
//     user: "Profile",
//   });
// });
module.exports = router;
