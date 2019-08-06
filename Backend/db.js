var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/votingDApp",{ useNewUrlParser: true });

var userSchema = new mongoose.Schema({
    name: String,
    password: String,
    userType: String,
    address: String
})

var userDetails = mongoose.model('userDetail', userSchema);

module.exports = userDetails;