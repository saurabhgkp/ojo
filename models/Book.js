const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    authorsId: [{
        type: String,
        required: true
    }],
    sellCount: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        unique: true,
        required: true
    },
    slugURL: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 100,
        max: 1000
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
