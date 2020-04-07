var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport")
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campgrounds");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

console.log(process.env.DATABASEURL);

mongoose.connect("mongodb://localhost/yelpcamp", {useUnifiedTopology: true, useNewUrlParser: true});
// mongoose.connect(process.env.DATABASEURL, {useUnifiedTopology: true, useNewUrlParser: true});
//mongoose.connect("mongodb+srv://dmed:texastech123@cluster0-4riqo.mongodb.net/test?retryWrites=true&w=majority", {useUnifiedTopology: true, useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));6
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the DB

// PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret: "Theo is the best and cutest dog in the world",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(3000, process.env.PORT, process.env.IP, function(){
	console.log('The YelpCamp server has started');
})