var mongoose = require('mongoose');

var categorySchema= mongoose.Schema({
    title: String
});


module.exports = mongoose.model('category',categorySchema);