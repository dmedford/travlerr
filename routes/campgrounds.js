var express = require('express');
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

// Index - Display all campgrounds
router.get("/", function(req,res){
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render('campgrounds/index',{campgrounds:allCampgrounds})
		}
	})
	;
});

// CREATE - Add new campgrounds to database
router.post("/", middleware.isLoggedIn, function(req,res){
	// Get Data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var price = req.body.price;
	var newCampground = {name: name, price: price, image:image, description: desc, author: author};
	// Create a new CG and save to the DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	})
})

// New - Show form to create new campgrounds
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
})

// SHOW - Shows more info about one campground
router.get('/:id', function(req,res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			// render the show template with that campground
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground:foundCampground});
		});
	});

// UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	//redirect somewhere (show page)
});

// Destroy Campground Route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
})







module.exports = router;