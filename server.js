"use strict";

require("dotenv").config();
const cors = require("cors");
const express = require("express");

const MongooseItems = require("./modules/mongoose-books");
const addbooksHandler = require("./modules/AddBooks");
const deletebooksHandler = require("./modules/DeleteBooks");

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT;

server.get("/", homeHandler);

server.get("/books", MongooseItems.booksHandler);

//localhost:3001/addbooks
server.post("/addbooks", addbooksHandler);

//localhost:3001/deletebooks
server.delete("/deletebooks/:id", deletebooksHandler);

function homeHandler(req, res) {
  res.send("Home page");
}

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
