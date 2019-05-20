const express    = require("express"),
      router     = express.Router(),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware"),
      mongoose   = require("mongoose");
    
mongoose.set("useFindAndModify", false);

// =====================
//   CAMPGROUND ROUTES
// =====================


//INDEX -- setup campgrounds GET route
router.get("/",function(req, res) {
  //get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    }else {
      res.render("campgrounds/index", {campgrounds:allCampgrounds, page: 'campgrounds'});
    }
  });
});

//CREATE -- Create new campground 
router.post("/", middleware.isLoggedIn, function(req, res){
  //get data from form and add to campgrounds array
  const name = req.body.name;
  const price = req.body.price;
  const image = req.body.image;
  const description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = {name:name, price:price, image:image, description:description, author:author};
  //Create a new campground and save it to DB
  Campground.create(newCampground, function(err, campground){
    if(err){
      console.log(err);
    }else {
      //console.log(campground);
      //redirect back to campgrounds page
      res.redirect("/campgrounds");
    }});
});

//NEW -- render to create new campground page
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new"); 
});

//SHOW -- show detail of each campground
router.get("/:id", function(req, res){
  //find the campground with provided ID and show detail and comments
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err || !foundCampground){
      req.flash("error", "Campground not found");
      res.redirect("back");
    }else {
      //console.log(foundCampground);
      //render show template with that campground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

//EDIT Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err || !foundCampground){
      req.flash("error", "Campground not found");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {campground:foundCampground});
  });
});

//UPDATE Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  //find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground,  function(err, updatedCampground){
    if(err){
      res.redirect("/campgrounds");
    }else {
      //redirect to show page
      res.redirect("/campgrounds/" + req.params.id);
    }  
  });
});

//DELETE Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  //delete campground
  Campground.findByIdAndRemove(req.params.id, function(err, removedCampground){
    if(err){
      console.log(err);
    }else {
      //delete all associated comments
      Comment.deleteMany({_id: {$in:removedCampground.comments}}, (err)=>{
        if(err){
          console.log(err);
        }
        res.redirect("/campgrounds");
      });
    }
  });
});

module.exports = router;