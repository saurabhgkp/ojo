var express = require("express");
var router = express.Router();
var userController = require("../controllers/users");
const isAuth = require('../middleware/isAuth')
const { body } = require("express-validator");

router.get("/", function (req, res) {
  res.send("this is User Route");
});


router.put("/updateProfile", isAuth, userController.updateProfile);

router.post("/logUserActivity", isAuth, userController.logUserActivity);

// router.post("/purchases", isAuth, userController.purchases);

router.get("/purchaseHistory", isAuth, userController.purchaseHistory);
module.exports = router;
