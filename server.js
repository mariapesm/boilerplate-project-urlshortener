'use strict';

var express = require('express'),
    mongo = require('mongodb'),
    mongoose = require('mongoose'),
    autoIncrement = require('mongodb-autoincrement'),
    bodyParser = require("body-parser"),
    cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

// Connect to mLab Mongo database.
mongoose.connect(process.env.MONGO_URI);

// Create DB Schema.
const Schema = mongoose.Schema;
const UrlSchema = new Schema({
  originalUrl: {type: String, required: true},
  shortUrl: Number
});

// Attach auto-increment plugin to Schema.
UrlSchema.plugin(autoIncrement.mongoosePlugin);

// Create DB Model.
var UrlModel = mongoose.model("Url", UrlSchema);


app.use(cors());

// Parse POST bodies - extended false restricts to String or Array value types.
// Place before any routes.
app.use( bodyParser.urlencoded({extended  : false}) );

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get("/swamp-fennel.glitch.me/new-:url", function(request, response, next) {
  var url = request.params.url;
  response.json({"original_url": url, "short_url": -1});
  next();
} );

app.post("/swamp-fennel.glitch.me/new", function(request, response, next) {
  var obj = request.body;
//   var url = new UrlModel({originalUrl: obj.url});
//   url.save(function(err, data) {
//     if (err) return console.error(err.stack||err);
//     return console.log("No errors.");
    
//   });
  UrlModel.create({originalUrl: obj.url, shortUrl: -1});
  
      
  response.json({"original_url": obj.url});
  next();
} );


app.listen(port, function () {
  console.log('Node.js listening ...');
});
