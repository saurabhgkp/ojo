var express = require("express");
var router = express.Router();
var indexController = require("../controllers/index");
const isAuth = require('../middleware/isAuth')
const { body } = require("express-validator");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("working data");
});

const loginValidation = [
  [body("password").notEmpty().withMessage("password is required"),
  body("email").notEmpty().withMessage("email is required").isEmail()
    .withMessage("Invalid Email"),]
];
const registerValidation = [
  [
    body("name").notEmpty().withMessage("name is required"),
    body("email").notEmpty().withMessage("email is required").isEmail()
      .withMessage("Invalid Email"),
    body("role").notEmpty().withMessage("role is required"),
    body("password").notEmpty().withMessage("password is required"),
  ]
];
const emailValidation = [
  [
    body("email").notEmpty().withMessage("email is required").isEmail()
      .withMessage("Invalid Email"),
  ]
];

router.post("/register", indexController.register);

router.get("/verify/:userId/:uniqueString", indexController.verify);

router.post("/login", loginValidation, indexController.login);

router.post("/forgotPassword", emailValidation, indexController.forgotPassword);

router.post("/resetPassword", emailValidation, indexController.resetPassword);

module.exports = router;
