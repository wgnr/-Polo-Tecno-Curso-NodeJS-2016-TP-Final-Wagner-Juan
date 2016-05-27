var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String
});

var personModel = mongoose.model('Persons', personSchema);

module.exports = personModel;