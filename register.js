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

const userProfileSchema = new Schema({
    user: ObjectId,
    username: String,
    email: String,
    password: String
});

// create a model and instantiate it
var UserModel = mongoose.model("User", userProfileSchema);	

// display the html to the user
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/register.html");
});

// define endpoint for saving login information
app.post("/registeruser", (req, res) => {
    var newUserData = new UserModel(req.body);	// the user registration data to be saved
    console.log(req.body.password);
    console.log(req.body.confirmpassword);


    // checking that the entered passwords are the same
    if (req.body.password === req.body.confirmpassword) {
    	// hashing password to store into database
    	bcrypt.hash(req.body.password, 10, function(err, hash) {
    	});

    	// save data in the database
    	newUserData.save()
    	.then(item => {
    		res.send("Name saved to database");

    		// this reports back full contents of the database
    		var stuff = UserModel.find({});
    		console.log(stuff);
    		var query  = UserModel.where({ });
    		query.find(function (err, kitten) {
    			if (err) return handleError(err);
    			if (kitten) {
    				console.log(kitten);
    			}
    		});
    	})
    	.catch(err => {
    		res.status(400).send("Unable to save to database");
    	});
	// passwords do not match, prompt user for a new one
} else {
		// passwordsMismatched();
	}

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

// function to say passwords do not match
function passwordsMismatched() {
	document.getElementById("passwordP").style.display = "visible";
}