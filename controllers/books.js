const Book = require("../models/Book");
const User = require('../models/usres');
const uploadEmail = require("../processors/uploadEmail");
// const bookReleases = require("../worker/bookReleases");

const asyncMiddlewareAuth = (handler) => {
    return async (req, res, next) => {
        console.log(req.body.role, "req.body.role")
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

exports.addBooks = asyncMiddlewareAuth(async (req, res) => {
    const { authorsId, title, description, price } = req.body;
    if (!authorsId || !title || !description || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    let slugURL = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const newBook = await Book.create({
        authorsId,
        title,
        description,
        price,
        slugURL
    });
    if (!newBook) {
        return res.status(404).json({ message: "data not found" });
    }
    let emails = await User.find({ role: 'retailer' }, { email: 1, _id: 0 });

    let authors = await User.find({ _id: { $in: authorsId } }, { name: 1, _id: 0 });

    uploadEmail({
        emails,
        subject: 'New Book Notification',
        text: `Dear Retailer,`,
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Books Care</a>
          </div>
          <p style="font-size:1.1em">Dear Retailer(s)</p>
          <p>
          A new book, ${title}, has been released by ${authors.map(a => a.name).join(', ')}
           <p>${description}</p>
           <p>price:${price}</p>
            Thank you .
          
          
          </p>
          <h2 style="background: #4044ee;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
             
              
              </h2>
          <p style="font-size:0.9em;">Regards,<br />Books Care</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            
            <p>	www.books.care </p><p>	5th Floor, 5A103 , Two Horizon Center, </p><p> Golf Course Road, DLF Phase-5, Sector- 43</p>Gurugram, Haryana-122002<p>
                
            </p>
          </div>
        </div>
      </div>`,
    })
    // bookReleases.sendBook(authorsId, title, description, price)
    return res.status(201).json({
        status: 1,
        message: newBook,
    });

})
exports.updateBook = asyncMiddlewareAuth(async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(404).json({ message: "data not found" });
    }
    const { authors, title, description, price } = req.body;
    if (!authors || !title || !description || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const book = await Book.findByIdAndUpdate(id, {
        authors,
        title,
        description,
        price
    })
    return res.status(201).json({
        status: 1,
        message: book,
    });
})
exports.deleteBookById = asyncMiddlewareAuth(async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(404).json({ message: "data not found" });
    }
    const data = await Book.findByIdAndDelete(id)
    return res.status(200).json({
        status: 1,
        message: "DELETE successfully ",
    })
})


exports.getBooks = asyncMiddleware(async (req, res) => {
    const books = await Book.find();
    return res.status(201).json({
        status: 1,
        message: books,
    });
})
exports.getBookById = asyncMiddleware(async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(404).json({ message: "data not found" });
    }
    const book = await Book.findById(id);
    return res.status(201).json({
        status: 1,
        message: book,
    });
})