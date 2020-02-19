var mongoose = require('mongoose');

var postSchema= mongoose.Schema({
    title : String,
    category: String,
    author: String,
    body:String,
    date : Date,
    image: String,
    comments: Array( {
        "name" : String,
        "email" : String,
        "body" : String,
        "commentDate" : Date
    } )
});


module.exports = mongoose.model('posts',postSchema);
