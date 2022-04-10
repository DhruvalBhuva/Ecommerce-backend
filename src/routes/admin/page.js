const express = require("express");
const {
  upload,
  requireSignIn,
  adminMiddlewere,
} = require("../../commen-middleware");
const { createPage, getPage } = require("../../controlles/admin/page");
const router = express.Router();

/**
 * To upload multiple field images fields() is used
 */
router.post(
  "/page/create",
  requireSignIn,
  adminMiddlewere,
  upload.fields([
    { name: "banners", maxCount: 5 },
    { name: "products", maxCount: 5 },
  ]),
  createPage
);

router.get(`/page/:category/:type`, getPage);
module.exports = router;
