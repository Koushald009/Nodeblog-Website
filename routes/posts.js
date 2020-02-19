var express = require('express');
var router = express.Router();
var Posts = require("../models/posts");
var Category = require("../models/categories");

router.get('/show/:id', function(req, res, next) {

    Posts.findById(req.params.id, function(err, post){
        res.render('show',{
            "post": post,
            "errors" : ""
        });
    });
});

router.get('/add', async function(req, res, next) {

    var categories = await Category.find();
    res.render('addpost',{
        "title": "Add Post",
        "categories": categories,
        "errors" : ""
    });

});

router.post('/add', function(req, res, next){
    
    var title    = req.body.title;
    var category = req.body.category;
    var body     = req.body.body;
    var author   = req.body.author;
    var date     = new Date();

    if(req.file.fieldname){
        var mainImageOriginalName = req.file.originalname;
        var mainImageMime         = req.file.mimetype;
        var mainImagePath         = req.file.path;
        var mainImageExt          = req.file.extension;
        var mainImageSize         = req.file.size;
    } else {
        var mainImageOriginalName = 'noimage.png';
    }

    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body','Body field is required').notEmpty();
    

    var errors = req.validationErrors();

    if(errors){
        res.render('addpost', {
            "errors": errors,
            "title": title,
            "body": body
        });
    } else {
        var post = new Posts({
            "title" : title,
            "category" : category,
            "body" : body,
            "author" : author,
            "date" : date,
            "image" : mainImageOriginalName
        });

        post.save(function(err, post) {
            if(err){
                res.send('There was an issue submitting the post');
            } else {
                res.location('/');
                res.redirect('/');
            }
        });
    }

    req.checkBody('name','Name field is required').notEmpty();
    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('email','Email not valid').isEmail();
    req.checkBody('username','Username field is required').notEmpty();
    req.checkBody('password','Password field is required').notEmpty();
    req.checkBody('password2','Password do not match').equals(req.body.password);

});


router.post('/addcomment', function(req, res, next){
    var name          = req.body.name;
    var email         = req.body.email;
    var body          = req.body.body;
    var postid        = req.body.postid;
    var commentdate   = new Date();

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not formatted correctly').isEmail();
    req.checkBody('body','Body field is required').notEmpty();
    var errors = req.validationErrors();

    if(errors){
        Posts.findById(postid, function(err, post){
            res.render('show', {
                "erors": errors,
                "post": post
            });
        });

    } else {
        var comment = {
            "name": name,
            "email": email,
            "body": body,
            "commentdate": commentdate
        };

        Posts.update(
            {_id : postid}, 
            { $push: {comments : comment } },
            function(err, post) {
                if(err){
                    throw err;
                } else {
                    console.log("Updated", post);
                    res.location('/posts/show/'+postid);
                    res.redirect('/posts/show/'+postid);
                }
            }
            );
    }
});

module.exports = router;

