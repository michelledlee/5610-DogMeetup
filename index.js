var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route
router.get('/', function (req, res) {
  res.send('Home page');
});

// define register page route
router.get('/register', function (req, res) {
  res.send('Register page');
});

// define login page route
router.get('/login', function (req, res) {
  res.send('Login page');
});

// define dog profile page route
router.get('/dogprofile', function (req, res) {
  res.send('Dog profile page');
});

module.exports = router;