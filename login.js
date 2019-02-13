var express = require("express");	// require express.js application
var app = express();				// creates an app by calling express
var port = 5000;					// define port to be 5000

// require body-parser to parse data to JSON
var bodyParser = require('body-parser');	
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// require bcrypt for hashing paswords
const bcrypt = require('bcrypt');

// require mongoose for MongoDB
const mongoose = require("mongoose");	
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/dogmeetup");

// define a model
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// define schemas
const dogProfileSchema = new Schema({
    dog: ObjectId,
    name: String,
    breed: String,
    age: String
});

var DogModel = mongoose.model("Dog", dogProfileSchema);  

const userProfileSchema = new Schema({
	user: ObjectId,
	username: String,
	email: String,
	password: String,
	confirmationpassword: String,
    dogs: [dogProfileSchema]
});

// create a model and instantiate it
var UserModel = mongoose.model("User", userProfileSchema);


// display the html to the user
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/login.html");
});

// define endpoint for verifying login information
app.post("/login", (req, res) => {
    var userLoginData = new UserModel(req.body);	// get login data
    var userEmail = req.body.email;
    var enteredPassword = req.body.password;
    console.log(req.body.email);
    console.log(req.body.password);

    // see if this username is in the database
    var query  = UserModel.where({ email: userEmail });
    query.findOne(function (err, user) {
    	if (err) return handleError(err);
    	if (user) {
    		console.log(user);
    		var password = user.password;
    		console.log(password);
    		bcrypt.compare(enteredPassword, password, function(err, res) {
    			console.log(res);
    			if (enteredPassword === password) {
    			// if (res) {
			   // fire up the profile page
			   console.log("we did it");
			} else {
			   // passwords don't match
			   console.log("we did not do it");
			} 
		});
    	}
    });
});

// set the app to listen on port 5000
app.listen(port, () => {
	console.log("Server listening on port " + port);
});