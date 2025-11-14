const express = require("express")
const app = express()
const cors = require("cors");
var logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();




const PORT = process.env.PORT;
const CONNECTION_URL = process.env.CONNECTION_URL;


app.use(cors("*"));
app.use(logger("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '15mb' }));



const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");
const adminRouter = require("./routes/admin");
const bookRouter = require("./routes/books");
const stripeRouter = require("./routes/stripe");
app.use("/v1/", indexRouter);
app.use("/v1/users", userRouter);
app.use("/v1/admin", adminRouter);
app.use("/v1/book", bookRouter);
app.use("/v1/stripe", stripeRouter);

mongoose.connect(CONNECTION_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server Running on Port: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
    });
