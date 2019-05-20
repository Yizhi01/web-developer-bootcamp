const express = require("express"),
      router  = express.Router(),
      User = require("../models/user"),
      passport = require("passport");

//setup landing GET route
router.get("/", function(req, res){
  res.render("landing");
});

// =====================
//     AUTH ROUTES
// =====================

//show register form
router.get("/register", function(req, res){
  res.render("register", {page: 'register'});
});

//handle sign up logic
router.post("/register", function(req, res) {
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Successfully signed up! Welcome to YelpCamp, " + req.body.username);
      res.redirect("/campgrounds");
    });
  });
});

//show login form
router.get("/login", function(req, res) {
  res.render("login",{page: 'login'});
});

//handle login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "campgrounds",
  failureRedirect: "/login",
  successFlash: 'Welcome back!', 
  failureFlash: 'Invalid username or password.',
}));

//Add logout route
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Successfully logged out!");
  res.redirect("/campgrounds");
});

module.exports = router;