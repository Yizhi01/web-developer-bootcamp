const express    = require("express"),
      router     = express.Router({mergeParams: true}),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware");

// =====================
//   COMMENT ROUTES
// =====================

//show comment new form
router.get("/new", middleware.isLoggedIn, function(req, res){
  //find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err || !campground){
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    }else{
      res.render("comments/new", {campground:campground});
    }
  });
});

//handle comment create 
router.post("/", middleware.isLoggedIn, function(req, res){
  //lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
    if(err || !campground){
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    }else {
      //create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        }else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          //connect new comment to campground and redirect to campground show page
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully added comment!");
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }  
  });
  
});

//Comment EDIT route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err || !foundCampground){
      req.flash("error", "Campground not found");
      res.redirect("back");
    }else {
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
          res.redirect("back");
        }else {
          res.render("comments/edit", {campground_id:req.params.id, comment:foundComment});
        }
      });
    }
  });
});

//Comment UPDATE route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back");
    }else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Comment DELETE route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    }else {
      req.flash("success", "Successfully deleted comment!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;