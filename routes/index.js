var express = require('express');
var router = express.Router();
var Persons = require('../models/persons.js');


/* GET home page. */
router.get('/', function(req, res){
	Persons.find({}, function(err, docs){
	 res.render('index', { title: 'Index', persons: docs});
	});
});

//router.get('/', function(req, res) {
//  res.render('index', { title: 'Express' });
//});

module.exports = router;