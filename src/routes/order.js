const { requireSignIn, userMiddlewere } = require("../commen-middleware");
const { addOrder, getOrders, getOrder } = require("../controlles/order");
const router = require("express").Router();

router.post("/addOrder", requireSignIn, userMiddlewere, addOrder);
router.get("/getOrders", requireSignIn, userMiddlewere, getOrders);
router.post("/getOrder", requireSignIn, userMiddlewere, getOrder);

module.exports = router;
