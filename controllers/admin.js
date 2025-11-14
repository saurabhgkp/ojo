const PurchaseRequest = require("../models/PurchaseRequest");
const Users = require("../models/usres");


const asyncMiddleware = (handler) => {
  return async (req, res, next) => {
    try {
      if (req.body.role !== "admin") {
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

exports.updateProfile = asyncMiddleware(async (req, res) => {
  const { email, name, age } = req.body;
  if (!email || !name || !age) {
    return res.status(404).json({ message: 'User not found' });
  }
  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.name = name;
  user.age = age
  await user.save();
  return res.json({ message: 'Profile updated successful' });
})

exports.getAllusers = asyncMiddleware(async (req, res) => {
  const alluser = await Users.find();
  return res.status(200).json({
    status: 1,
    message: alluser,
  })
})
exports.userActive = asyncMiddleware(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(404).json({
      status: 0,
      message: "user not found",
    })
  }
  let data = await Users.findById(id);
  data.isActive = true
  data.save()
  return res.status(201).json({
    status: 1,
    message: "user active ",
  });
})
exports.userInactive = asyncMiddleware(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(404).json({
      status: 0,
      message: "user not found",
    })
  }
  let data = await Users.findById(id);
  data.isActive = false
  data.save()
  return res.status(201).json({
    status: 1,
    message: "user inactive ",
  });
})

exports.RequestList = asyncMiddleware(async (req, res) => {
  const requests = await PurchaseRequest.find().populate('bookId');
  return res.status(200).json({
    status: 1,
    message: requests,
  })
})

