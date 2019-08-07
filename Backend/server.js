var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var authRouter = require("./routes.js");

app.use(authRouter);

app.use(express.static("../Public"));
app.use(express.static("../build"));
app.use(express.static('../node_modules'));



app.get('/', (req,res) => {
    res.sendFile(path.resolve("../Public/html/index.html"))
})

app.listen('3000',() =>{
    console.log("Server Started on port 3000");
})

module.exports = app;