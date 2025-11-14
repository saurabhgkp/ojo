const User = require("../models/usres");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const mailVarification = require("../utils/mailVerification")
const sendOtpEmail = require("../utils/sendOtpEmail");
const Book = require("../models/Book");
const { validationResult } = require("express-validator");
const Purchase = require("../models/Purchase");


const asyncMiddlewareAuth = (handler) => {
  return async (req, res, next) => {
    try {
      if (req.body.role !== "user") {
        return res.status(401).json({
          status: 0,
          message: "Request not authorized.",
        });
      }
      await handler(req, res, next);
    } catch (ex) {
      next(ex);
    }
  };
};
const asyncMiddleware = (handler) => {
  return async (req, res, next) => {
    try {
      // if (req.body.role !== "user") {
      //   return res.status(401).json({
      //     status: 0,
      //     message: "Request not authorized.",
      //   });
      // }
      await handler(req, res, next);
    } catch (ex) {
      next(ex);
    }
  };
};

exports.updateProfile = asyncMiddlewareAuth(async (req, res) => {
  const { email, name, age } = req.body;
  if (!email || !name || !age) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.name = name;
  user.age = age
  await user.save();
  return res.json({ message: 'Profile updated successful' });
})
exports.logUserActivity = asyncMiddlewareAuth(async (req, res) => {
  let { userId } = req.body
  if (!userId) {
    return res.status(400).json({ message: 'userId fields are required' });
  }
  const newActivity = new UserActivity({
    userId,
    action: "Logged in",
  });

  await newActivity.save();

})

exports.purchaseHistory = asyncMiddlewareAuth(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const purchaseHistory = await Purchase.find({ userId });
  res.status(200).json(purchaseHistory);
})


// exports.purchases = asyncMiddlewareAuth(async (req, res) => {
//   const { bookId, userId, price, quantity } = req.body;

//   if (!bookId || !userId || !price || !quantity) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }


//   const currentDate = new Date();
//   const purchaseId = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
//     .toString()
//     .padStart(2, '0')}-${await getNextPurchaseId()}`;

//   const newPurchase = await Purchase.create({
//     purchaseId,
//     bookId,
//     userId,
//     price,
//     quantity,
//     purchaseDate: currentDate,
//   });


//   const book = await Book.findOne({ bookId });
//   if (!book) {
//     return res.status(404).json({ error: 'Book not found' });
//   }

//   // Update author(s) revenue based on the purchase
//   const revenueIncrease = price * quantity;
//   await Book.updateOne({ bookId }, { $inc: { sellCount: quantity } }); // Assuming sellCount represents the total sold quantity

//   // Notify author(s) about the purchase information
//   const authorEmails = book.authors; // Assuming authors field is an array of author emails
//   await sendEmailNotification(authorEmails, revenueIncrease);

//   res.status(201).json({ message: 'Purchase request sent successfully' });
// })
