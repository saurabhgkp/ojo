var express = require("express");
var router = express.Router();
var stripeController = require("../controllers/stripe");
const isAuth = require('../middleware/isAuth')


/* GET home page. */
router.get("/", function (req, res, next) {
    res.send("stripe working ");
});


router.post("/createCheckoutSession", isAuth, stripeController.createCheckoutSession);
router.post("/webhook", stripeController.webhook);
router.get("/getUsersOrders", isAuth, stripeController.getUsersOrders);



module.exports = router;
