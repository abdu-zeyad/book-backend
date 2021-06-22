"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());

const PORT = process.env.PORT;

//connect the express server with mongodb
mongoose.connect("mongodb://localhost:27017/books", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//create a schema
const BookSchema = new mongoose.Schema({
  BookName: String,
  description: String,
  status: String,
});

//create a schema
const userSchema = new mongoose.Schema({
  ownerEmail: String,
  books: [BookSchema],
});

//create a model
const myBookModel = mongoose.model("book", BookSchema);

//create a model
const myOwnerModel = mongoose.model("user", userSchema);

//data seeding (store data)
function y() {
  const bookA = new myBookModel({
    BookName: "bookb",
    description: "nodescription",
    status: "notavaliable",
  });

  bookA.save();
}

// y();

//data seeding
function x() {
  const abdelmajed = new myOwnerModel({
    ownerEmail: "abdalmajeed76543@gmail.com",
    books: [
      {
        bookName: "fluffy",
        description: "American",
        status: "avaliable",
      },
    ],
  });

  abdelmajed.save();
}

// x();

app.get("/", homeHandler);
app.get("/books", getBooksHandler);
app.post("/addBook", addBookHandler); //demo 13
app.delete("/deleteBook/:index", deltedBookHandler);

function homeHandler(req, res) {
  res.send("Home Route");
}

function getBooksHandler(req, res) {
  let requestedOwnerEmail = req.query.email;
  myOwnerModel.find(
    { ownerEmail: requestedOwnerEmail },
    function (err, ownerData) {
      if (err) {
        console.log("something went wrong");
      } else {
        // console.log(ownerData[0].cats);
        res.send(ownerData[0].books);
      }
    }
  );
}

function addBookHandler(req, res) {
  console.log(req.body);
  const { BookName, description, status, ownerEmail } = req.body;
  myOwnerModel.find({ ownerEmail: ownerEmail }, (error, ownerData) => {
    if (error) {
      res.send("something went wrong");
    } else {
      console.log(ownerData[0].books);
      ownerData[0].books.push({
        BookName: BookName,
        description: description,
        status: status,
      });
      ownerData[0].save();
      res.send(ownerData[0].books);
    }
  });
}

function deltedBookHandler(req, res) {
  const { email } = req.query;
  const index = Number(req.params.index);
  console.log(typeof index);

  myOwnerModel.find({ ownerEmail: email }, (err, ownerData) => {
    if (err) {
      console.log("something went wrong");
    } else {
      const newBooksArr = ownerData[0].books.filter((book, idx) => {
        if (idx !== index) {
          return book;
        }
      });
      ownerData[0].books = newBooksArr;
      ownerData[0].save();
      res.send(ownerData[0].books);
    }
  });
}

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
