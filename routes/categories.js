var express = require('express');
var router = express.Router();
var Category= require("../models/categories");

router.get('/show/:category', function(req, res, next) {

    var db = req.db;
    var posts = db.get('posts');
    posts.find({category: req.params.category}, {}, function(err, posts){
        res.render('index', {
            "title": req.params.category,
            "posts": posts
        });
    });
});

router.get('/add', async function(req, res, next) {
    res.render('addcategory', {
        "title": "Add Category",
        "errors" : ""
    });
});

router.post('/add', function(req, res, next){
    var title    = req.body.title;
    req.checkBody('title', 'Title field is required').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        res.render('addcategory', {
            "erors": errors,
            "title": title
        });
    } else {
        var category = new Category({
            "title" : title
        });
        category.save(function(err, category) {
            if(err){
                res.send('There was an issue submitting the post');
            } else {
                res.location('/');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;
