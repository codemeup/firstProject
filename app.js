var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require('cookie-session');
var db = require("./models/index");
var methodOverride = require('method-override');
var routeMiddleware = require("./config/routes");
var AWS = require('aws-sdk');

var app = express();

// configure Express
app.set('view engine', 'ejs');
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(session({
    secret: 'keyboard cat',
    name: 'fbcookz',
    maxage: 3600000
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/public'));
  app.use(methodOverride('_method'));

// S3 Config
AWS.config.region = 'us-west-2';
var AWS_ACCESS_KEY = process.env.S3_ACCESS_KEY_HH;
var AWS_SECRET_KEY = process.env.S3_SECRET_KEY_HH;
var S3_BUCKET = process.env.S3_BUCKET_HH;

var s3bucket = new AWS.S3({params: {Bucket: S3_BUCKET}});
// Examples
// s3bucket.createBucket(function() {
//   var data = {Key: 'myKey', Body: 'Hello!'};
//   s3bucket.putObject(data, function(err, data) {
//     if (err) {
//       console.log("Error uploading data: ", err);
//     } else {
//       console.log("Successfully uploaded data to myBucket/myKey");
//     }
//   });
// });


//dummy data
// db.User.create({fbid:10100962562768904,
//                 name: "John",
//                 ownerOrLover:true,
//                 favoriteBreed:"Poodle",
//                 contactEmail:"john@email.com",
//                 contactNumber: 9875673635,
//                 about: "loves dog walking",
//                 streetAddress: "501 Folsom Street",
//                 zipCode: 98765,
//                  });
// db.User.create({fbid:10100962562768998,
//                 name: "Penny",
//                 ownerOrLover:false,
//                 favoriteBreed:"golden retreiver",
//                 contactEmail:"penny@email.com",
//                 contactNumber: 9875683635,
//                 about: "loves cozy afternoons with a dog",
//                 streetAddress: "100 Folsom Street",
//                 zipCode: 98785,
//                  });

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function checkAuthentication(req, res, callback) {
  if (req.isAuthenticated()) { return callback(); }
  res.redirect('/login');
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN!");
  db.User.find({
      where: {
        fbid: id
      }
    })
    .done(function(error,user){
      done(error, user);
    });
});


// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: process.env.FBID,
    clientSecret: process.env.FBSECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...

    process.nextTick(function () {
      console.log("nextTick Ran", profile);
      db.User.findOrCreate({
        where:{
          fbid: profile.id,
          name: profile.displayName,
          // contactEmail: profile.emails
          // birthday: profile.birthday,
          // photo: profile.photos
        }
      }).done(function(err,user){
        console.log("done Ran");
        return done(null, profile);
      });
    });
  }
));

app.get('/', function(req, res){
  res.render('index', { user: req.user});
});

app.get('/index', routeMiddleware.preventLoginSignup, function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', routeMiddleware.checkAuthentication, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', routeMiddleware.preventLoginSignup, function(req, res){
  res.render('index', { user: req.user });
});

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Check if FIBID is in db, if so hasAccount = true, otherwise false
    console.log("returned from facebook", JSON.stringify(req.session));
    req.session.hasAccount = false;

    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/ownerSignup', routeMiddleware.checkAuthentication, function(req, res){
  res.render('ownerSignup', { user: req.user });
});

app.get('/loverSignup', routeMiddleware.checkAuthentication, function(req, res){
  res.render('loverSignup', { user: req.user });
});

app.post('/users', function(req, res){
  console.log("POSTING USER FORM!!");
  console.log("Owner Or Lover? ", req.body.user.ownerOrLover);
  var usertype = true;
  if(req.body.user.ownerOrLover == "true"){
    var usertype = "dogOwner";
    console.log("ownerOrLover set to owner");
  } else {
    var usertype = "dogLover";
    console.log("ownerOrLover set to lover");
  }
  var fbid = req.user.fbid;
  var name = req.user.name;
  var ownerOrLover = req.body.user.ownerOrLover;
  var favoriteBreed = req.body.user.favoriteBreed;
  var contactEmail = req.body.user.contactEmail;
  var contactNumber = req.body.user.contactNumber;
  var about = req.body.user.about;
  var streetAddress = req.body.user.streetAddress;
  var zipCode = req.body.user.zipCode;
  //console.log("posting user details " + fbid + ownerOrLover + name + favoriteBreed + contactEmail + contactNumber + about + streetAddress + zipCode);

  req.user.updateAttributes({
    ownerOrLover:ownerOrLover,
    favoriteBreed:favoriteBreed,
    contactEmail:contactEmail,
    contactNumber:contactNumber,
    about:about,
    streetAddress:streetAddress,
    zipCode:zipCode
  });

  if(ownerOrLover == "true"){
    res.redirect('/dogSignup'); 
  } else {
  res.redirect('/homepage'); 
  }
});
 
//dog signup
app.get('/dogSignup', routeMiddleware.checkAuthentication, function(req, res){
  res.render('dogSignup', { user: req.user });
});
app.post('/dogs', function(req, res){
  console.log("POSTING DOG FORM!!");
  var name = req.body.dog.name;
  var breed = req.body.dog.breed;
  var age = req.body.dog.age;
  var about = req.body.dog.about;
  var walkiesNeeds = req.body.dog.walkiesNeeds;
  var guiltyPleasure = req.body.dog.guiltyPleasure;
  var userId = req.user.id;
  
  console.log("posting dog details " + name + breed + age + about + walkiesNeeds + guiltyPleasure);

  db.Dog.create({name:name,
                  breed:breed,
                  age:age,
                  about:about,
                  walkiesNeeds:walkiesNeeds,
                  guiltyPleasure:guiltyPleasure,
                  userId: userId});
  res.redirect('/homepage'); 
});

//show all users
app.get('/users/index', routeMiddleware.checkAuthentication, function(req, res){
  var users = [];
  db.User.findAll().done(function(err, users){
    users = users;
    console.log(users);
    res.render('Users/index', { user: req.user, users: users });
  }); 
});

app.get('/users/:id', routeMiddleware.checkAuthentication, function(req, res){
  res.render('Users/show', { user: req.user });
});

app.get('/dogSignup', routeMiddleware.checkAuthentication, function(req, res){
  res.render('dogSignup', { user: req.user });
});

//homepage
app.get('/homepage', routeMiddleware.checkAuthentication, function(req, res){
  res.render('homepage', { user: req.user });
});

//show all dogs
app.get('/dogs/index', routeMiddleware.checkAuthentication, function(req, res){
  var dogs = [];
  var user = 
  db.Dog.findAll().done(function(err, dogs){
    console.log(err);
    dogs = dogs;
    
    res.render('Dogs/index', { dogs: dogs});
  }); 
});

// db.User.find({where: {name: this}}).done(function (err, owner) {
//   db.User.tagOwnerClass().done(function(err,ownerClass)
  // )
//    owner.tagOwnerClass().done(function (err, ownerClass) {
//     printCast(owner, ownersGroup);
//   });
// });

//sudocode
// app.get("/posts", function (req, res) {
//   db.Post.findAll({include: [db.Author, db.Tag]}).done(function (err, allPosts) {
//     res.render("posts/index.ejs", {posts: allPosts});
//   });
// });

// app.get("/posts/:id", function (req, res) {
//   db.Post.find({
//     where: {id: req.params.id},
//     include: [db.Author, db.Tag]
//   }).done(function (err, post) {
//     res.render("posts/show.ejs", {post: post});
//   });
// });

// app.post("/posts", function (req, res) {
//   var authorParams = req.body.author;
//   var postParams = req.body.post;
//   var tagParams = req.body.tags;

//   var tagArr = tagParams.split(",");

//   var createTags = function (post) {
//     if (tagArr.length === 0) {
//       res.redirect("/posts");
//     } else {
//       var tagObj = {name: tagArr.pop()};
//       db.Tag.findOrCreate({
//         where: tagObj,
//         defaults: tagObj
//       }).done(function (err, tag, created) {
//         post.addTag(tag);
//         createTags(post);
//       });
//     }
//   };

//   var createPost = function(err, author, created) {
//     db.Post.create(postParams).done(function(err, post) {
//       author.addPost(post).done(function () {
//         createTags(post);
//       });
//     });
//   };
//end

app.get("*",function(req,res){
  res.status(404);
  res.render("404");
});

app.listen(3000, function(){
  console.log('Server is getting started on port 3000');
});

