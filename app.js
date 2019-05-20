const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      methodOverride = require("method-override"),
      flash          = require("connect-flash"),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      User           = require("./models/user"),
      Campground     = require("./models/campground"),
      Comment        = require("./models/comment"),
      seedDB         = require("./seeds");
      
const PORT = 4000;

//requiring routes
const indexRoutes      = require("./routes/index"),
      campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes    = require("./routes/comments");
      
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
//console.log(__dirname);

//configure method-override
app.use(methodOverride("_method"));

//configure connect-flash before passport configuration
app.use(flash());

//connect mongoose
const databaseURL = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(databaseURL, {useNewUrlParser: true});

//empty everything in database to start and then add in some campgrounds and comments
//seedDB();

//Configure passport
app.use(require("express-session")({
  secret: "This is yelp camp application",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//add middleware in every single route
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//call app to use routes, first argument means to the routes all start with this argument route
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(PORT, function(){
  console.log(`http://localhost:${PORT}`);
  console.log("The YelpCamp server has started"); 
});