var express = require('express');
var router = express.Router();
var posts = require('../models/posts');

router.get('/', function(req, res, next) {
posts.find((err,doc)=>{
  console.log("Doc:", doc);
    if(!err)
      res.render('index', {
         "posts": doc
      });
  }); 
});

module.exports = router;
