var routeMiddleware = {
  checkAuthentication: function(req, res, next) {
    if (!req.user) {
      res.render('index', {message: "Please log in first"});
    }
    else {
     return next();
    }
  },

  preventLoginSignup: function(req, res, next) {
    if (req.user) {
      res.redirect('/homepage');
    }
    else {
     return next();
    }
  }
};
module.exports = routeMiddleware;