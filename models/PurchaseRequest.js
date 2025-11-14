const mongoose = require("mongoose");

const PurchaseRequests = mongoose.Schema({
    userId: String,
    orderId: String,
    totalPrice: Number,
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

});

var PurchaseRequest = mongoose.model("PurchaseRequest", PurchaseRequests);

module.exports = PurchaseRequest;