const express = require("express");
const { requireSignIn, userMiddlewere } = require("../commen-middleware");
const { addAddress, getAddress } = require("../controlles/address");

const router = express.Router();

router.post("/address/create", requireSignIn, userMiddlewere, addAddress);
router.post("/getaddress", requireSignIn, userMiddlewere, getAddress);

module.exports = router;
