module.exports = {
  // Middleware that redirects the user to '/login' is not connected
  isConnected: function(req,res,next) {
    // If we are connected, express defines a req.user
    if (req.user) {
      next()
    }
    else {
      res.redirect('/login')
    }
  },
  checkAdmin: function(req,res,next) {
    if (req.user && req.user.role === 'Boss') {
      next()
    }
    else {
      backURL=req.header('Referer') || '/';
      res.render("index", { user: req.user, message: "You have to be Boss for this operation" });
    }
  },
  checkRole: function(role) {
    return function(req,res,next) {
      if (req.user && req.user.role === role) {
        next()
      }
      else {
        res.redirect('/')
      }
    }
  },
}