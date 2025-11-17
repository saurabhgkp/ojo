const stripe = require("stripe")(process.env.STRIPE_KEY);
const Book = require("../models/Book");
const Purchase = require("../models/Purchase");
const uploadEmail = require("../processors/uploadEmail");
// const revenueIncrease = require("../utils/revenueIncrease");
const User = require("../models/usres");
const PurchaseHistory = require("../models/Purchase");
const PurchaseRequest = require("../models/PurchaseRequest");
function generatePurchaseId() {
  return `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}-1`;
}

const asyncMiddlewareAuth = (handler) => {
  return async (req, res, next) => {
    try {
      // console.log(req.body.role, "req.body.role")
      // if (req.body.role !== "user") {
      //   return res.status(401).json({
      //     status: 0,
      //     message: "Request not authorized.",
      //   });
      // }
      await handler(req, res, next);
    } catch (ex) {
      console.log(ex, "<=======================ex");
      next(ex);
    }
  };
};

exports.createCheckoutSession = async (req, res) => {
  try {
    // return console.log(req.body, "req.body")
    const { role, products, totalPrice, userId } = req.body;

    if (role !== "user")
      return res.status(401).json({ message: "Request not authorized." });
    if (!Array.isArray(products) || products.length === 0)
      return res.status(400).json({ message: "No products provided." });
    if (!userId)
      return res.status(400).json({ message: "userId is required." });

    const orderId = `order_${Math.random().toString(36).slice(2, 15)}`;

    const purchaseDocs = products.map(({ productId, price, quantity = 1 }) => {
      if (!productId || !price)
        throw new Error("Each product must include productId and price.");
      return { orderId, productId, price, quantity, purchaseDate: new Date() };
    });

    await PurchaseHistory.insertMany(purchaseDocs);
    await PurchaseRequest.create({ orderId, userId, totalPrice });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Your Order ${orderId}` },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { orderId, userId },
      success_url: "https://surabhfrontend-qssr.vercel.app/order",
      cancel_url: "https://surabhfrontend-qssr.vercel.app/order",
    });
    console.log(session, "session.url===================");
    res.status(200).json({ paymentUrl: session.url }); // ✅ one response only
  } catch (err) {
    console.log("Stripe checkout error:", err);
    if (!res.headersSent) res.status(500).json({ message: err.message });
  }
};

exports.webhook = async (req, res) => {
  // console.log(req.body, "req.body")
  // // Verify the webhook signature for security (recommended for production)
  // const signature = req.headers['stripe-signature'];
  // let event;

  // try {
  //   event = stripe.webhooks.constructEvent(req?.body, signature, process.env.STRIPE_SECRET_KEY);
  //   console.log(event?.type, "event -------------00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000--->", "event")
  // } catch (err) {
  //   console.error('Webhook signature verification failed.', err);
  //   return res.status(400).send(`Webhook Error: ${err.message}`);
  // }

  let event = req.body;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    const purchaseRequestData = await PurchaseRequest.findOne({ orderId });
    // console.log(purchaseRequestData, "purchaseRequestData")
    if (purchaseRequestData) {
      purchaseRequestData.status = "approved";
      await purchaseRequestData.save();
    }

    // Example: send confirmation email
    const authorsId = purchaseRequestData?.userId;
    console.log(authorsId, "authorsId");
    const result = await User.findOne({ _id: authorsId });
    const emails = result?.email;
    console.log(emails, "emails");
    await uploadEmail({
      emails,
      subject: "Purchase Notification",
      html: `<p>Dear Author(s), your book(s) have been purchased successfully.</p>`,
    });
  }

  res.sendStatus(200);
};

exports.getUsersOrders = async (req, res) => {
  try {
    // ✅ Get userId from token (middleware should add req.user)
    const { userId } = req.body;

    if (!userId)
      return res
        .status(401)
        .json({ message: "Unauthorized. Token missing or invalid." });

    // ✅ Fetch all orders created by this user
    const orders = await PurchaseRequest.find({ userId }).sort({
      createdAt: -1,
    });

    if (!orders || orders.length === 0)
      return res
        .status(404)
        .json({ message: "No orders found for this user." });

    // ✅ For each order, find products from PurchaseHistory
    const orderList = await Promise.all(
      orders.map(async (order) => {
        const products = await PurchaseHistory.find(
          { orderId: order.orderId },
          { productId: 1, _id: 0 } // only include productId
        );
        return {
          orderId: order.orderId,
          totalPrice: order.totalPrice,
          productIds: products.map((p) => p.productId),
        };
      })
    );

    const allProductIds = orderList.flatMap((order) => order.productIds);

    res.status(200).json({ orders: allProductIds });
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
