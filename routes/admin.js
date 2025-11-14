var express = require("express");
var router = express.Router();
var adminController = require("../controllers/admin");
const isAuth = require('../middleware/isAuth')

/* GET users listing. */
router.get("/", function (req, res) {

  res.send("this is Admin Route");
});
router.put("/updateProfile", isAuth, adminController.updateProfile);
router.get("/getAllusers", isAuth, adminController.getAllusers);
router.get("/userActive", isAuth, adminController.userActive);
router.get("/userInactive", isAuth, adminController.userInactive);
router.get("/RequestList", isAuth, adminController.RequestList);
module.exports = router;
