const express = require("express");
const {
  addCategory,
  getCategories,
  updateCategories,
  deleteCategories,
} = require("../controlles/category");
const { requireSignIn, adminMiddlewere, upload } = require("../commen-middleware");
const router = express.Router();

router.post(
  "/category/create",
  requireSignIn,
  adminMiddlewere,
  upload.single("categoryImage"),
  addCategory
);

router.post(
  "/category/update",
  upload.array("categoryImage"),
  updateCategories
);

router.get("/category/getcategory", getCategories);
router.post("/category/delete", deleteCategories);

module.exports = router;
