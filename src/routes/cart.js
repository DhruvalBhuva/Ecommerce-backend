const express = require("express");
const router = express.Router();

const { addItemToCart, getCartItems } = require("../controlles/cart");
const { requireSignIn, userMiddlewere } = require("../commen-middleware");

router.post("/cart/addtocart", requireSignIn, userMiddlewere, addItemToCart);
router.post("/cart/getcartitems",requireSignIn, userMiddlewere, getCartItems);

module.exports = router;
