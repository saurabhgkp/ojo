const mongoose = require('mongoose');

const purchaseHistorySchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    productId: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    },
    // userId: {
    //     type: String,
    //     required: true
    // },
    purchaseDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
     
});

const PurchaseHistory = mongoose.model('PurchaseHistory', purchaseHistorySchema);

module.exports = PurchaseHistory;
