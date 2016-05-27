var Person = require('../models/persons');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tpPolo');

var p = new Person({
	firstName: "Chano",
	lastName: "Apellido",
	email: "Chano@Apellido.com",
	password: "passwordComplicada"	
 });

p.save(function(err, doc){
    console.log(err, doc);    
});
