var express=require("express");
var app=express();
var mongoose=require('mongoose');
var flash=require("connect-flash");
var passport=require("passport");  
var LocalStrategy=require("passport-local");

var Campground=  require("./models/campground");
var methodOverride= require("method-override");
var Comment=  require("./models/comment");
var User=require("./models/user");  
// var User=  require("./models/user");
var seedDB=  require("./seeds");
var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");
//var expressSanitizer= require("express-sanitizer");

//seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_camp_v4",{
	useNewUrlParser: true,
	useCreateIndex: true
}).then(()=>{
	console.log("Connected to database!");
}).catch(err=>{
	console.log("err: ", err.message);
});
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

//PASSPORT CONFiG

app.use(require("express-session")({
	secret: "Ankit is twelve years old ",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());   

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);





app.listen(3000, process.env.IP, function(){
	console.log("YelpCamp server has started!!");
});