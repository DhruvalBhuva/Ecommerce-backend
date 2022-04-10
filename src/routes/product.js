const express = require("express");
const {
  requireSignIn,
  adminMiddlewere,
  upload,
} = require("../commen-middleware");
const {
  createProduct,
  getProductsBySlug,
  getProductDetailsById,
} = require("../controlles/product");

const router = express.Router();


router.post(
  "/product/create",
  requireSignIn,
  adminMiddlewere,
  upload.array("productPictures"),
  createProduct
);


router.get("/product/:slug", getProductsBySlug);
router.get("/productdetails/:productId", getProductDetailsById);

module.exports = router;
