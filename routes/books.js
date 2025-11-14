var express = require("express");
var router = express.Router();
var booksController = require("../controllers/books");
const isAuth = require('../middleware/isAuth')

router.get("/", function (req, res) {
    res.send("this is books Route");
});


router.post("/addBooks", isAuth, booksController.addBooks);
router.get("/getBooks", booksController.getBooks);
router.get("/getBookById:id", booksController.getBookById);
router.put("/updateBook:id", isAuth, booksController.updateBook);
router.delete("/deleteBookById:id", isAuth, booksController.deleteBookById);
module.exports = router;
