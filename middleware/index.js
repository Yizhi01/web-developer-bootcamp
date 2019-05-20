const Campground = require("../models/campground"),
      Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  //is user logged in?
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err || !foundCampground){ //handle error 
        req.flash("error", "Campground not found!");
        res.redirect("back");
      }else {
        //does user own the campground?
        //console.log(foundCampground.author.id); //return an object
        //console.log(req.user._id); //return a string
        //use equals method from mongo to check ownership
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }else {
          //otherwise, redirect
          req.flash("error", "You don't have permission to do that!");
          res.redirect("/campgrounds");
        }
      }
    });
  }else {
    //if not, redirect
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
  //is user logged in?
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err || !foundComment){
        req.flash("error", "Comment not found!");
        res.redirect("back");
      }else {
        //does user own the campground?
        //console.log(foundCampground.author.id); //return an object
        //console.log(req.user._id); //return a string
        //use equals method from mongo to check ownership
        if(foundComment.author.id.equals(req.user._id)){
          next();
        }else {
          //otherwise, redirect
          req.flash("error", "You don't have permission to do that!");
          res.redirect("/campgrounds");
        }
      }
    });
  }else {
    //if not, redirect
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
  }
};

middlewareObj.isLoggedIn = function (req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");
};

module.exports = middlewareObj;