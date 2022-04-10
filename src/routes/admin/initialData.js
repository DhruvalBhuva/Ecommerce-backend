const express = require("express");
const { requireSignIn, adminMiddlewere } = require("../../commen-middleware");
const { initialData } = require("../../controlles/admin/initialData");
const router = express.Router();

router.post("/initialdata", requireSignIn, adminMiddlewere, initialData);

module.exports = router;
