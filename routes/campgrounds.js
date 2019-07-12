var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var middleware=require("../middleware");


//INDEX-show all campgrounds
router.get("/campgrounds",function(req,res){
	
	
	
	//get all campgrounds
	Campground.find({},function(err, allcampgrounds){
		if(err){
		console.log("Error: ");
		console.log(err);
	}else{
		res.render("campgrounds/index", {campgrounds:allcampgrounds,currentUser: req.user});
	}
		
	});
});

//create 
router.post("/campgrounds",middleware.isLoggedIn, function(req, res){
	
	//get data from the form and add to campgrounds array
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var desc=req.body.description;
	 var author= {
		id: req.user._id,
		username: req.user.username
	};
	
	var newCampground={name: name,price:price, image: image,description: desc, author:author};
	//create a new campground and save to DB
	Campground.create(newCampground, function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			 //redirect back to campgrounds page
		res.redirect("/campgrounds");	
		}
	});
	
	
	
});
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

//SHOW-shows more info about one campground
router.get("/campgrounds/:id", function(req,res){
	//find the campground with the required id;
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		} else{
			//render show template with that campground
			//console.log(foundCampground);
			 res.render("campgrounds/show",{campground: foundCampground});
			
		}
	});
	
});

//EDIT ROUTE
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});	
	});
});

//UPDATE ROUTE
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req,res){
		//req.body.blog.body=req.sanitize(req.body.blog.body);
	//var data={name: req.body.name,image: req.body.image}
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/" + req.params.id );
		}
	}) ;
	
});

//DESTROY CAMPGROUND ROUTE

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,  function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){ 
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
             }
    });
});




module.exports=router;